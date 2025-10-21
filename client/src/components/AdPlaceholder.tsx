interface AdPlaceholderProps {
  className?: string;
}

export default function AdPlaceholder({ className = "" }: AdPlaceholderProps) {
  return (
    <div 
      className={`h-[100px] rounded-md border-2 border-dashed border-border flex items-center justify-center ${className}`}
      data-testid="ad-placeholder"
    >
      <p className="text-sm text-muted-foreground">Ad space — coming soon</p>
    </div>
  );
}
