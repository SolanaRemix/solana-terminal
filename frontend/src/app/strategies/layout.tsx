import '../../styles/globals.css';
import { Sidebar } from '@/components/ui/Sidebar';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-6">{children}</main></div>;
}
