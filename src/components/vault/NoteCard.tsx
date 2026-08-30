import { Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  Lock,
  MoreVertical,
  Pencil,
  FolderInput,
  Trash2,
  Star,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CategoryChip } from "./CategoryChip";
import { formatWhen, useVault, type Note } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export function NoteCard({
  note,
  onDelete,
}: {
  note: Note;
  onDelete?: (note: Note) => void;
}) {
  const { toggleFavorite, updateNote, state } = useVault();
  const navigate = useNavigate();

  const hidePreview = state.settings.hidePreviews;

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("EDIT BUTTON CLICKED:", note.id);

    navigate({
      to: "/note/$id/edit",
      params: {
        id: note.id,
      },
    });
  };

  return (
    <div className="vault-card animate-fade-up relative p-4 transition-colors hover:border-primary/40">
      <Link
        to="/note/$id"
        params={{ id: note.id }}
        className="block pr-16"
        aria-label={`Open ${note.title}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {note.locked && (
            <Lock className="h-3.5 w-3.5 shrink-0 text-gold" />
          )}

          <h3 className="truncate text-[15px] font-semibold">
            {note.title}
          </h3>
        </div>

        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {hidePreview || note.locked
            ? "Preview hidden for privacy"
            : note.content || "No content"}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <CategoryChip name={note.category} />

          <span className="text-[11px] text-muted-foreground">
            {formatWhen(note.updatedAt)}
          </span>
        </div>
      </Link>

      <div
        className="absolute right-3 top-3 z-20 flex items-center gap-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* FAVORITE */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(note.id);
          }}
          aria-label="Toggle favorite"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:text-gold"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              note.favorite && "fill-gold text-gold",
            )}
          />
        </button>

        {/* MORE */}
        <DropdownMenu>
          <DropdownMenuTrigger
  asChild
>
  <button
    type="button"
    aria-label="More options"
    className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <MoreVertical className="h-4 w-4" />
  </button>
</DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="z-[100] w-48"
          >
            {/* EDIT */}
            <DropdownMenuItem
  onSelect={(event) => {
    event.preventDefault();
    console.log("EDIT CLICKED");
    navigate({
      to: "/note/$id/edit",
      params: { id: note.id },
    });
  }}
>
  <Pencil className="mr-2 h-4 w-4" />
  Edit
</DropdownMenuItem>

            {/* FAVORITE */}
            <DropdownMenuItem
              onSelect={() => {
                toggleFavorite(note.id);
              }}
            >
              <Star className="mr-2 h-4 w-4" />
              {note.favorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>

            {/* MOVE TO CATEGORY */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInput className="mr-2 h-4 w-4" />
                Move to category
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                {state.categories.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onSelect={() => {
                      updateNote(note.id, {
                        category: c.name,
                      });
                    }}
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* DELETE */}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => {
                onDelete?.(note);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* DIRECT EDIT BUTTON - TEST */}
      <button
        type="button"
        onClick={handleEdit}
        className="absolute bottom-3 right-3 z-30 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
      >
        Edit
      </button>
    </div>
  );
}