import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider, QueryProvider } from '@/providers';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import SelectedItemsFlyout from '@/components/SelectedItemsFlyout';
import '@/index.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <div className="min-h-screen bg-background text-foreground">
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    {children}
                  </main>
                  <SelectedItemsFlyout />
                </div>
              </ErrorBoundary>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
