
import './globals.css';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-200 p-4">
          <div className="container mx-auto flex justify-center">
            <div className="flex items-center">
              <Link href="/quote" className="text-gray-800 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">Quote</Link>
              <Link href="/underwriting" className="text-gray-800 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">Underwriting</Link>
              <Link href="/customer-servicing" className="text-gray-800 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">Customer Servicing</Link>
              <Link href="/billing" className="text-gray-800 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">Billing</Link>
              <Link href="/finance" className="text-gray-800 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">Finance</Link>
              <Link href="/claims" className="text-gray-800 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">Claims</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
