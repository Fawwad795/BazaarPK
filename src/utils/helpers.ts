export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDiscountPercentage(price: number, originalPrice: number): number {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push('full');
    } else if (rating >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}-${randomNum}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
