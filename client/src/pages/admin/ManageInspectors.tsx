import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, Search, Users, Shield, Phone, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { insertInspectorSchema, type Inspector } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Form schema for creating/editing inspectors
const inspectorFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const inspectorUpdateSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type InspectorForm = z.infer<typeof inspectorFormSchema>;
type InspectorUpdate = z.infer<typeof inspectorUpdateSchema>;

export default function ManageInspectors() {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingInspector, setEditingInspector] = useState<Inspector | null>(null);

  // Fetch inspectors
  const { data: inspectorsData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/inspectors', currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false');
      }
      
      const response = await fetch(`/api/admin/inspectors?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch inspectors');
      }
      
      return response.json();
    },
  });

  // Create inspector mutation
  const createMutation = useMutation({
    mutationFn: async (data: InspectorForm) => {
      const response = await fetch('/api/admin/inspectors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create inspector');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inspectors'] });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Inspector created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create inspector",
        variant: "destructive",
      });
    },
  });

  // Update inspector mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InspectorUpdate }) => {
      const response = await fetch(`/api/admin/inspectors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update inspector');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inspectors'] });
      setEditingInspector(null);
      toast({
        title: "Success",
        description: "Inspector updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update inspector",
        variant: "destructive",
      });
    },
  });

  // Delete inspector mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/inspectors/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete inspector');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inspectors'] });
      toast({
        title: "Success",
        description: "Inspector deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inspector",
        variant: "destructive",
      });
    },
  });

  // Forms
  const createForm = useForm<InspectorForm>({
    resolver: zodResolver(inspectorFormSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      phone: "",
      isActive: true,
      password: "",
      confirmPassword: "",
    },
  });

  const editForm = useForm<InspectorUpdate>({
    resolver: zodResolver(inspectorUpdateSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      phone: "",
      isActive: true,
      password: "",
      confirmPassword: "",
    },
  });

  // Set form values when editing
  React.useEffect(() => {
    if (editingInspector) {
      editForm.reset({
        username: editingInspector.username,
        email: editingInspector.email,
        fullName: editingInspector.fullName,
        phone: editingInspector.phone ?? "",
        isActive: editingInspector.isActive,
        password: "",
        confirmPassword: "",
      });
    }
  }, [editingInspector, editForm]);

  const handleCreate = (data: InspectorForm) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: InspectorUpdate) => {
    if (editingInspector) {
      updateMutation.mutate({ id: editingInspector.id, data });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filter inspectors based on search term
  const filteredInspectors = inspectorsData?.inspectors?.filter((inspector: Inspector) =>
    inspector.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspector.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Inspectors</h1>
          <p className="text-text-grey">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-black">Manage Inspectors</h1>
              <p className="text-text-grey mt-2">Create and manage field inspector accounts</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" className="text-brand-green border-brand-green hover:bg-brand-green hover:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <Link href="/admin">
            <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              location === '/admin' 
                ? 'bg-brand-green text-white' 
                : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
            }`}>
              <i className="fas fa-home mr-2"></i>
              Dashboard
            </span>
          </Link>
          <Link href="/admin/add-blog">
            <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              location === '/admin/add-blog' 
                ? 'bg-brand-green text-white' 
                : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
            }`}>
              <i className="fas fa-plus mr-2"></i>
              Add Blog
            </span>
          </Link>
          <Link href="/admin/manage-blogs">
            <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              location === '/admin/manage-blogs' 
                ? 'bg-brand-green text-white' 
                : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
            }`}>
              <i className="fas fa-list mr-2"></i>
              Manage Blogs
            </span>
          </Link>
          <Link href="/admin/manage-inspectors">
            <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              location === '/admin/manage-inspectors' 
                ? 'bg-brand-green text-white' 
                : 'text-text-grey hover:text-brand-green hover:bg-gray-100'
            }`}>
              <Users className="h-4 w-4 mr-2 inline" />
              Manage Inspectors
            </span>
          </Link>
        </nav>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search inspectors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                    data-testid="input-search-inspectors"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-green hover:bg-brand-green/90" data-testid="button-create-inspector">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inspector
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Inspector</DialogTitle>
                    <DialogDescription>
                      Add a new field inspector account with secure login credentials.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                      <FormField
                        control={createForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} data-testid="input-full-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter username" {...field} data-testid="input-username" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter email address" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter secure password" {...field} data-testid="input-password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm password" {...field} data-testid="input-confirm-password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select value={field.value ? "active" : "inactive"} onValueChange={(value) => field.onChange(value === "active")}>
                                <SelectTrigger data-testid="select-inspector-status">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                          {createMutation.isPending ? "Creating..." : "Create Inspector"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Inspectors List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Inspectors ({inspectorsData?.total || 0})
            </CardTitle>
            <CardDescription>
              Manage field inspector accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
              </div>
            ) : filteredInspectors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-text-grey">No inspectors found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspectors.map((inspector: Inspector) => (
                      <TableRow key={inspector.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-brand-green" />
                            </div>
                            <div>
                              <p className="font-medium text-text-black" data-testid={`text-inspector-name-${inspector.id}`}>
                                {inspector.fullName}
                              </p>
                              <p className="text-sm text-text-grey">@{inspector.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span data-testid={`text-inspector-email-${inspector.id}`}>{inspector.email}</span>
                            </div>
                            {inspector.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span data-testid={`text-inspector-phone-${inspector.id}`}>{inspector.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={inspector.isActive ? "default" : "secondary"}
                            className={inspector.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            data-testid={`badge-inspector-status-${inspector.id}`}
                          >
                            {inspector.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog open={editingInspector?.id === inspector.id} onOpenChange={(open) => setEditingInspector(open ? inspector : null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" data-testid={`button-edit-inspector-${inspector.id}`}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Inspector</DialogTitle>
                                  <DialogDescription>
                                    Update inspector account information and credentials.
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...editForm}>
                                  <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
                                    <FormField
                                      control={editForm.control}
                                      name="fullName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Full Name</FormLabel>
                                          <FormControl>
                                            <Input {...field} data-testid="input-edit-full-name" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="username"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Username</FormLabel>
                                          <FormControl>
                                            <Input {...field} data-testid="input-edit-username" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="email"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Email</FormLabel>
                                          <FormControl>
                                            <Input type="email" {...field} data-testid="input-edit-email" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="phone"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Phone (Optional)</FormLabel>
                                          <FormControl>
                                            <Input {...field} data-testid="input-edit-phone" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="password"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>New Password (Optional)</FormLabel>
                                          <FormControl>
                                            <Input type="password" placeholder="Leave blank to keep current password" {...field} data-testid="input-edit-password" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="confirmPassword"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Confirm New Password</FormLabel>
                                          <FormControl>
                                            <Input type="password" placeholder="Confirm new password" {...field} data-testid="input-edit-confirm-password" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="isActive"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Status</FormLabel>
                                          <FormControl>
                                            <Select value={field.value ? "active" : "inactive"} onValueChange={(value) => field.onChange(value === "active")}>
                                              <SelectTrigger data-testid="select-edit-inspector-status">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button type="button" variant="outline" onClick={() => setEditingInspector(null)}>
                                        Cancel
                                      </Button>
                                      <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit-update">
                                        {updateMutation.isPending ? "Updating..." : "Update Inspector"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" data-testid={`button-delete-inspector-${inspector.id}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Inspector</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete inspector "{inspector.fullName}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(inspector.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    data-testid={`button-confirm-delete-${inspector.id}`}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {inspectorsData && inspectorsData.pages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-text-grey">
                  Page {inspectorsData.page} of {inspectorsData.pages} ({inspectorsData.total} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-previous-page"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(inspectorsData.pages, currentPage + 1))}
                    disabled={currentPage === inspectorsData.pages}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}