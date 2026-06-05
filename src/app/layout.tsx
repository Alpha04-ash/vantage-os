import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantage OS | AI Financial Simulator",
  description: "Start with $100K. Reach $1M without going bankrupt. Learn real money decisions by actually making them. Every decision is analyzed in real-time by AI, acting as your financial advisor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <Script id="pendo-install" strategy="afterInteractive">{`
(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track', 'trackAgent', 'clearSession'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('b1e2a3c2-07a7-43ad-b8c5-e924f4d56e28');

(function() {
  try {
    var localData = localStorage.getItem("vantage-v15-multiflow");
    if (localData) {
      var parsed = JSON.parse(localData);
      var currentUser = parsed.state ? parsed.state.currentUser : null;
      if (currentUser) {
        pendo.initialize({
          visitor: {
            id: currentUser.operatorId,
            email: currentUser.clearance || '',
            balance: currentUser.balance || 0,
            learningXP: currentUser.learningXP || 0,
            impactPoints: currentUser.impactPoints || 0,
            savingsDeposited: currentUser.savingsDeposited || 0,
            fiscalDays: currentUser.fiscalDays || 0,
            lastSavedTimestamp: currentUser.lastSavedTimestamp || 0,
            timeSpeed: currentUser.timeSpeed || 1,
            securityScore: currentUser.securityScore || 0,
            threatLevel: currentUser.threatLevel || 'GUARDED'
          }
        });
        return;
      }
    }
  } catch (e) {
    console.error("Pendo local storage parse failed:", e);
  }
  pendo.initialize();
})();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
