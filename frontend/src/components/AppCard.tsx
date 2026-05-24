import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Application } from "../services/applicationService";

interface AppCardProps {
  application: Application;
  onDelete: (name: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ application, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    if (window.confirm(`Are you sure you want to delete the application "${application.name}"?`)) {
      onDelete(application.name);
    }
  };

  return (
    <Link to={`/dashboard/${application.name}`} className="block">
      <Card className="hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold truncate">{application.name}</CardTitle>
          <CardDescription>
            Created: {new Date(application.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {/* We can add more info here later if needed, e.g., log counts */}
        </CardContent>
        <CardFooter className="pt-0 flex justify-end">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            title="Delete Application"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
