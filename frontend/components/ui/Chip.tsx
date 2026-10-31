import clsx from 'clsx';

export default function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={clsx('chip', className)}>{children}</span>;
}
