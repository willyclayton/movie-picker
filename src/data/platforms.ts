export type Platform = {
  key: string;
  label: string;
  providerId: number;
  color: string;
};

export const PLATFORMS: Platform[] = [
  { key: 'netflix',   label: 'Netflix',     providerId: 8,    color: 'bg-red-600' },
  { key: 'amazon',    label: 'Prime Video', providerId: 9,    color: 'bg-blue-400' },
  { key: 'disney',    label: 'Disney+',     providerId: 337,  color: 'bg-blue-600' },
  { key: 'hulu',      label: 'Hulu',        providerId: 15,   color: 'bg-green-500' },
  { key: 'max',       label: 'Max',         providerId: 1899, color: 'bg-purple-700' },
  { key: 'apple',     label: 'Apple TV+',   providerId: 350,  color: 'bg-gray-600' },
  { key: 'paramount', label: 'Paramount+',  providerId: 531,  color: 'bg-blue-500' },
  { key: 'peacock',   label: 'Peacock',     providerId: 386,  color: 'bg-yellow-500' },
];
