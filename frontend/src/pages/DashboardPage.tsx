import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { applicationService, type Application } from "../services/applicationService";
import { AppCard } from "../components/AppCard";
import { CreateAppModal } from "../components/CreateAppModal";
import { Button } from "@/components/ui/button";
import { Copy, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { developer, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getApplications();
      // Handle either direct array return or wrapped in { data: ... } depending on backend structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apps = Array.isArray(res) ? res : (res as any).data || [];
      setApplications(apps);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
  }, []);

  const handleCreateApplication = async (name: string) => {
    await applicationService.createApplication(name);
    await fetchApplications(); // refresh the list
  };

  const handleDeleteApplication = async (name: string) => {
    try {
      await applicationService.deleteApplication(name);
      await fetchApplications();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || "Failed to delete application");
    }
  };

  const copyApiKey = async () => {
    if (developer?.apiKey) {
      await navigator.clipboard.writeText(developer.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!developer) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {developer.username}!</h1>
          <p className="text-muted-foreground mt-1">Manage your applications and view logs.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="bg-muted/50 border rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium mb-1">Your API Key</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Use this key to authenticate your SDK requests. Keep it secret!
          </p>
          <div className="flex items-center gap-2 bg-background p-2 rounded border font-mono text-sm break-all">
            <span className="flex-1">{developer.apiKey}</span>
            <Button variant="ghost" size="icon" onClick={copyApiKey} title="Copy API Key">
              <Copy className="h-4 w-4" />
            </Button>
            {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Applications</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create App
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive border-destructive/30 border p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <p className="text-muted-foreground animate-pulse">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-4">Create your first application to start logging.</p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Application
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <AppCard key={app._id} application={app} onDelete={handleDeleteApplication} />
          ))}
        </div>
      )}

      <CreateAppModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onCreate={handleCreateApplication} 
      />
    </div>
  );
};

export default DashboardPage;
