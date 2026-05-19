import "./globals.css";

export const metadata = {
  title: "Polacheck's Jewelers | Luxury Watches & Jewelry",
  description: "Polacheck’s Jewelers offers some of the world’s finest luxury watches, jewelry, and loose diamonds. Shop Polacheck’s Jewelers for the latest collection of Rolex, Patek, Panerai, Breitling, TUDOR watches. Visit today.",
  icon:" /src/app/favicon.png"
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>

        

        {children}

      </body>
    </html>
  );
}