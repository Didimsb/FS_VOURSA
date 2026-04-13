import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PropertyCard.module.css';

/**
 * Luxury PropertyCard Component
 * Agence Voursa — Desert Gold + Navy Theme
 * Supports RTL Arabic layout
 *
 * @param {Object}  props.property  — property object from API
 * @param {number}  props.index     — card index for staggered animation delay
 */
const PropertyCard = ({ property, index = 0 }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [heartActive, setHeartActive] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(0);
  const priceRef = useRef(null);
  const animatedRef = useRef(false);

  // ── Resolve property fields (compatible with existing API shape) ──────────
  const imageUrl  = property?.images?.[0] || property?.imageUrl || '/maison.jpg';
  const reference = property?.reference || property?._id?.slice(-5).toUpperCase() || '-----';
  const price     = Number(property?.price) || 0;
  const area      = property?.area != null ? `${property.area}م²` : null;
  const category  = property?.propertyType || property?.category || 'عقار';
  const status    = property?.status || 'للبيع';
  const publishDate = property?.createdAt
    ? `تاريخ النشر: ${new Date(property.createdAt).toLocaleDateString('fr-FR')}`
    : '';
  const propertyId = property?._id || property?.id;

  // ── Badge text mapping ────────────────────────────────────────────────────
  const badgeText = {
    للبيع: 'للبيع',
    بيع: 'تم البيع',
    للايجار: 'للإيجار',
    مؤجر: 'تم التأجير',
  }[status] || status;

  // ── Price counter animation on scroll into view ───────────────────────────
  const animatePrice = useCallback(() => {
    if (animatedRef.current || price === 0) return;
    animatedRef.current = true;

    const duration = 1800;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayPrice(Math.floor(eased * price));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplayPrice(price);
    };

    requestAnimationFrame(step);
  }, [price]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animatePrice(); },
      { threshold: 0.15 }
    );
    const el = priceRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [animatePrice]);

  // ── Ripple effect ─────────────────────────────────────────────────────────
  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left  = `${e.clientX - rect.left - radius}px`;
    circle.style.top   = `${e.clientY - rect.top  - radius}px`;
    circle.classList.add(styles.ripple);

    btn.querySelector(`.${styles.ripple}`)?.remove();
    btn.appendChild(circle);
  };

  // ── Card inline style for staggered animation ─────────────────────────────
  const cardStyle = { animationDelay: `${index * 0.12}s` };

  return (
    <div className={styles.card} style={cardStyle} dir="rtl">

      {/* ── Image Header ── */}
      <div className={styles.cardHeader}>
        {/* Skeleton */}
        <div className={`${styles.skeleton} ${imgLoaded ? styles.hidden : ''}`} />

        <img
          src={imageUrl}
          alt={property?.title || 'عقار'}
          className={`${styles.cardImage} ${imgLoaded ? styles.loaded : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />
        <div className={styles.imageOverlay} />

        {/* ── Badges Row ── */}
        <div className={styles.badgesContainer}>
          {/* Sale badge (right) */}
          <span className={styles.badge}>{badgeText}</span>

          {/* Ref + Heart (left) */}
          <div className={styles.topLeftGroup}>
            <span className={styles.refBadge}>رقم : {reference}</span>
            <button
              className={`${styles.heartBtn} ${heartActive ? styles.heartActive : ''}`}
              onClick={() => setHeartActive(prev => !prev)}
              aria-label="حفظ العقار"
            >
              {heartActive ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className={styles.cardBody}>

        {/* Category Tag */}
        <span className={styles.categoryTag}>{category}</span>

        {/* Contact */}
        <div className={styles.contactLabel}>
          📞 للاستفسار والتواصل :
        </div>

        {/* Price */}
        <div className={styles.priceContainer} ref={priceRef}>
          <div className={styles.priceLabel}>السعر :</div>
          <div className={styles.priceValue}>
            <span>{displayPrice.toLocaleString('fr-FR')}</span>
            <span className={styles.priceCurrency}>اوقية قديمة</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Stats */}
        {area && (
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>📐</span>
              <span>{area}</span>
            </div>
          </div>
        )}

        {/* Publish Date */}
        {publishDate && (
          <div className={styles.publishDate}>{publishDate}</div>
        )}

        <div className={styles.divider} />

        {/* CTA */}
        <button
          className={styles.ctaBtn}
          onClick={(e) => {
            handleRipple(e);
            navigate(`/property/${propertyId}`);
          }}
        >
          <span>عرض المزيد</span>
          <span className={styles.ctaBtnArrow}>←</span>
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;