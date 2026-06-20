import BottomNavClient from './BottomNavClient';

export default function BottomNav({
  menuCategories,
  settings,
  contact,
}: {
  menuCategories?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: any;
}) {
  return (
    <BottomNavClient
      menuCategories={menuCategories}
      settings={settings}
      contact={contact}
    />
  );
}
