"""Permanently redact identifying text from a sample PDF.

Usage: python scripts/anonymize-sample-report.py INPUT OUTPUT /tmp/private-terms.json
The JSON file contains an array of identifying phrases. Do not commit the
private input or terms. Redaction removes underlying text/image content, then
garbage collection removes superseded PDF objects.
"""
import json
import sys
from pathlib import Path

import pymupdf as fitz

source, destination, terms_path = sys.argv[1:]
terms = json.loads(Path(terms_path).read_text())
if not terms or any(not isinstance(term, str) or not term.strip() for term in terms):
    raise ValueError("Supply a nonempty array of identifying phrases")
document = fitz.open(source)
redactions = 0
for page in document:
    for term in terms:
        for rect in page.search_for(term):
            page.add_redact_annot(rect, fill=(1, 1, 1))
            redactions += 1
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS)
document.set_metadata({"title": "Anonymized UrbanGrid sample inspection report", "author": "UrbanGrid"})
document.save(destination, garbage=4, clean=True, deflate=True)
document.close()
with fitz.open(destination) as check:
    text = "\n".join(page.get_text() for page in check).casefold()
    if any(term.casefold() in text for term in terms):
        Path(destination).unlink()
        raise RuntimeError("Identifying text remains; output removed")
print(f"Redacted {redactions} occurrences; output text verified")