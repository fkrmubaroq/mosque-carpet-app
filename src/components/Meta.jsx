import Head from "next/head";

const defaultFavicon = [
  "/img/logo-black.ico",
  "/img/logo-black_180x180.png"
]
export default function Meta({ children, customTitle, description, title, favicon, faviconMedium }) {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="description"
        content={description || ""}
      ></meta>
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href={favicon || defaultFavicon[0]}
      />
      <link
        rel="apple-touch-icon"
        type="image/x-icon"
        sizes="180x180"
        href={faviconMedium || defaultFavicon[1]}
      />
      {customTitle ? <title>{customTitle}</title> :
        <title>{title ? `Al-Hijra | ${title}` : "Al-Hijra"}</title>
      }
      {children}
    </Head>
  );
}