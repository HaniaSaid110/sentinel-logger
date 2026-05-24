import React, { useState, useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => Promise<void>;
}

export const CreateAppModal: React.FC<CreateAppModalProps> = ({ open, onOpenChange, onCreate }) => {
  const [error, setError] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createAction = async (_prevState: any, formData: FormData) => {
    const name = formData.get("name") as string;
    if (!name) {
      return { error: "Name is required" };
    }
    
    try {
      await onCreate(name);
      onOpenChange(false);
      return { error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return { error: err.message || "Failed to create application" };
    }
  };

  const [state, formAction, isPending] = useActionState(createAction, { error: null });

  // Reset error when modal closes
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Application</DialogTitle>
          <DialogDescription>
            Enter a unique name for your new application. No spaces allowed.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                id="name"
                name="name"
                placeholder="e.g. my-awesome-app"
                disabled={isPending}
                pattern="^\S+$"
                title="No spaces allowed"
                required
              />
              {(state.error || error) && (
                <p className="text-sm text-destructive">{state.error || error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
