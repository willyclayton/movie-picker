import { cn } from '@/lib/utils';
import type { StreamingService } from '@/types/streaming';

type StreamingBadgeProps = {
  service: StreamingService;
  className?: string;
};

// Map known services to brand colors
const SERVICE_COLORS: Record<string, string> = {
  netflix: 'bg-red-600 text-white',
  hulu: 'bg-green-500 text-white',
  disney: 'bg-blue-600 text-white',
  amazon: 'bg-blue-400 text-white',
  hbo: 'bg-purple-700 text-white',
  max: 'bg-purple-700 text-white',
  appletv: 'bg-gray-600 text-white',
  apple: 'bg-gray-600 text-white',
  paramount: 'bg-blue-500 text-white',
  peacock: 'bg-yellow-500 text-black',
  tubi: 'bg-orange-500 text-white',
  pluto: 'bg-teal-600 text-white',
};

const TYPE_LABELS: Record<string, string> = {
  subscription: '',
  rent: ' · rent',
  buy: ' · buy',
  free: ' · free',
};

function formatServiceName(name: string): string {
  const names: Record<string, string> = {
    netflix: 'Netflix',
    hulu: 'Hulu',
    disney: 'Disney+',
    amazon: 'Prime',
    hbo: 'HBO',
    max: 'Max',
    appletv: 'Apple TV+',
    apple: 'Apple TV+',
    paramount: 'Paramount+',
    peacock: 'Peacock',
    tubi: 'Tubi',
    pluto: 'Pluto TV',
  };
  return names[name.toLowerCase()] ?? name;
}

export function StreamingBadge({ service, className }: StreamingBadgeProps) {
  const colorClass = SERVICE_COLORS[service.name.toLowerCase()] ?? 'bg-overlay text-muted';
  const label = formatServiceName(service.name) + (TYPE_LABELS[service.type] ?? '');

  const badge = (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-sans font-medium',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );

  if (service.link) {
    return (
      <a href={service.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        {badge}
      </a>
    );
  }

  return badge;
}
