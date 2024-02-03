import Script from "next/script";

export default function GoogleTagManager({ id }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WDDKQF8P17"></Script>
      <Script id={id}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());gtag('config', 'G-WDDKQF8P17');
          `,
        }}>
        
      </Script>
    </>
  )
}