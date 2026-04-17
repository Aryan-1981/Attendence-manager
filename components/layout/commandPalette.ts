export type CommandGroup = "Pages" | "Actions" | "Students";

export type CommandItem = {
  id: string;
  label: string;
  group: CommandGroup;
  keywords?: string;
  onSelect: () => void;
};
