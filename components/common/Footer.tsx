import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { fetcher } from "@/lib/fetcher";

export default async function Footer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const social: any = await fetcher("/social-media");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings: any = await fetcher("/settings");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pages: any = await fetcher("/pages");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contact: any = await fetcher("/contact");

  return (
    <footer className="bg-white border-t border-gray-200 rounded-sm mt-4">
      {/* <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Explore Sky Brands... Think to the Sky.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-center h-24">
              <Image
                alt=""
                src="https://skybuybd.com/_next/static/media/logo.2d8160b9.svg"
                width={1200}
                height={1200}
                className="w-40"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-center h-24">
              <Image
                alt=""
                src="https://skybuybd.com/_next/static/media/skyone.192d7933.png"
                width={1200}
                height={1200}
                className="w-40"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-center h-24">
              <Image
                alt=""
                src="https://skybuybd.com/_next/static/media/sky-track.3d4e773f.png"
                width={1200}
                height={1200}
                className="w-40"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-center h-24">
              <Image
                alt=""
                src="https://skybuybd.com/_next/static/media/skyexpress.3f90a79f.svg"
                width={1200}
                height={1200}
                className="w-40"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-36 rounded-full flex items-center justify-center">
                    <Link href="/" prefetch aria-label="Go to homepage">
                      <Image
                        alt="Logo"
                        src={`${process.env.NEXT_PUBLIC_IMG_URL}/${settings?.data?.dark_logo}`}
                        width={1200}
                        height={1200}
                        className="w-full"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {settings?.data?.description}
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">
                    {contact?.data?.address}
                  </p>
                </div>
                <Link
                  href={`mailto:${contact?.data?.email}`}
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-gray-600 text-sm group-hover:text-primary transition-colors">
                    {contact?.data?.email}
                  </span>
                </Link>
                <Link
                  href={`tel:${contact?.data?.phone}`}
                  className="flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-gray-600 text-sm group-hover:text-primary transition-colors">
                    {contact?.data?.phone}
                  </span>
                </Link>
                <Link
                  href={contact?.data?.maplink}
                  target="_blank"
                  className="flex items-center gap-3 group text-left"
                >
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm group-hover:text-primary transition-colors">
                    Find us on map
                  </span>
                </Link>
              </div>
            </div>

            {/* Information */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Information
              </h3>
              <ul className="space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {pages?.data?.map((page: any) => (
                  <li key={page?.id}>
                    <Link
                      href={`/info/${page?.slug}`}
                      className="text-gray-600 text-sm hover:text-primary transition-colors"
                    >
                      {page?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Social Links
              </h3>
              <div className="flex gap-4 mb-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {social?.data?.map((item: any) => (
                  <Link
                    key={item?.title}
                    target="_blank"
                    href={item?.link}
                    aria-label={`Visit our ${item?.title ?? "social"} page`}
                  >
                    <i
                      className={`${item?.icon} fa-xl`}
                      style={{
                        color: item?.color,
                      }}
                    ></i>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>
            {settings?.data?.copyright} | Developed by{" "}
            <Link
              href="https://danpite.tech/"
              target="_blank"
              className="text-primary font-semibold"
            >
              Danpite.Tech
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
