import "../globals.css";

export default function RedirectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("trainvent-theme");if(t==="light"){document.documentElement.dataset.theme="light";document.documentElement.style.colorScheme="light"}}catch(e){}',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
