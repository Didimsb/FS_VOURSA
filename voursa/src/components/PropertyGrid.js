import React, { useState, useEffect, useCallback } from 'react';
import PropertyCard from './PropertyCard';
import { getAllProperties } from '../services/PropertyService';

const gridStyles = {
  section: {
    width: '100%',
    padding: '0 0 40px',
    fontFamily: "'Cairo', 'Tajawal', sans-serif",
    direction: 'rtl',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  empty: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 0',
    fontSize: '1.2rem',
    color: '#888',
    fontFamily: "'Cairo', 'Tajawal', sans-serif",
  },
};

/* Responsive CSS injected once at module load */
const GRID_RESPONSIVE_CSS = `
  @media (max-width: 991px) {
    .voursa-property-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .voursa-property-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
      scroll-snap-type: y mandatory;
      overflow-y: auto;
    }
    .voursa-property-grid > * {
      scroll-snap-align: start;
    }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('voursa-grid-css')) {
  const el = document.createElement('style');
  el.id = 'voursa-grid-css';
  el.textContent = GRID_RESPONSIVE_CSS;
  document.head.appendChild(el);
}

/* ─── Skeleton Card ──────────────────────────── */
const SkeletonCard = () => (
  <div style={{
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.8)',
  }}>
    {/* Skeleton image */}
    <div style={{
      height: '240px',
      background: 'linear-gradient(90deg, #E8DCC8 0px, #F8F4ED 40%, #E8DCC8 80%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonLoad 1.5s infinite linear',
    }} />
    {/* Skeleton body */}
    <div style={{ padding: '22px' }}>
      {[40, 65, 90, 50, 100].map((w, i) => (
        <div key={i} style={{
          height: i === 4 ? '50px' : '14px',
          width: `${w}%`,
          borderRadius: i === 4 ? '12px' : '6px',
          marginBottom: '12px',
          background: 'linear-gradient(90deg, #E8DCC8 0px, #F8F4ED 40%, #E8DCC8 80%)',
          backgroundSize: '200% 100%',
          animation: `skeletonLoad 1.5s ${i * 0.1}s infinite linear`,
        }} />
      ))}
    </div>
  </div>
);

/* Inject keyframe for skeleton if missing */
if (typeof document !== 'undefined' && !document.getElementById('voursa-skeleton-kf')) {
  const el = document.createElement('style');
  el.id = 'voursa-skeleton-kf';
  el.textContent = `
    @keyframes skeletonLoad {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(el);
}

/* ─── PropertyGrid Component ─────────────────── */
const PropertyGrid = ({
  externalProperties,
  externalLoading,
  skeletonCount = 6,
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);

  const useExternal = externalProperties !== undefined;

  const fetchProperties = useCallback(async () => {
    if (useExternal) return;
    setLoading(true);
    try {
      const { properties: data } = await getAllProperties(1, 12, {});
      setProperties(data || []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [useExternal]);

  useEffect(() => {
    if (!useExternal) fetchProperties();
  }, [fetchProperties, useExternal]);

  useEffect(() => {
    if (useExternal) {
      setProperties(externalProperties || []);
      setLoading(externalLoading ?? false);
    }
  }, [useExternal, externalProperties, externalLoading]);

  const isLoading = useExternal ? (externalLoading ?? loading) : loading;

  return (
    <div style={gridStyles.section} dir="rtl">
      <div className="voursa-property-grid" style={gridStyles.grid}>
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={`skel-${i}`} />
          ))
        ) : properties.length > 0 ? (
          properties.map((property, idx) => (
            <PropertyCard
              key={property._id || property.id || idx}
              property={property}
              index={idx}
            />
          ))
        ) : (
          <div style={gridStyles.empty}>
            🏜️ لا توجد عقارات متاحة حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyGrid;
