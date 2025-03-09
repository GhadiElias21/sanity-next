'use client';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: '𝕏'
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: 'f'
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      icon: 'in'
    }
  ];

  return (
    <div className="flex items-center gap-6 mt-8 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-600">Share Event:</span>
      <div className="flex gap-4">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 text-gray-600 hover:text-blue-500 hover:-translate-y-1"
            aria-label={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
} 