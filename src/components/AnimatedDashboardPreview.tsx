import React from 'react';

export default function AnimatedDashboardPreview() {
  return (
    <div id="demo" className="animated-dashboard stagger animate-fade" aria-hidden>
      <div className="dash-card animate-pop" style={{ width: 420, animationDelay: '0s' }}>
        <div className="dash-card-header">
          <div className="dash-chip" />
          <div className="dash-title">Product Overview</div>
        </div>
        <div className="dash-bars">
          <div className="bar-row">
            <div className="bar-label">Orders</div>
            <div className="bar-track"><div className="bar-fill fill-1" /></div>
          </div>
          <div className="bar-row">
            <div className="bar-label">Revenue</div>
            <div className="bar-track"><div className="bar-fill fill-2" /></div>
          </div>
          <div className="bar-row">
            <div className="bar-label">Conversion</div>
            <div className="bar-track"><div className="bar-fill fill-3" /></div>
          </div>
        </div>
      </div>

      <div className="dash-card small animate-fade-up" style={{ width: 220, animationDelay: '0.12s' }}>
        <div className="dash-card-header">
          <div className="dash-chip" />
          <div className="dash-title">Today</div>
        </div>
        <div className="dash-today">
          <div className="stat">32</div>
          <div className="stat-sub">Orders</div>
        </div>
      </div>

      <div className="dash-card small animate-fade-up" style={{ width: 220, animationDelay: '0.22s' }}>
        <div className="dash-card-header">
          <div className="dash-chip" />
          <div className="dash-title">Upcoming</div>
        </div>
        <div className="dash-today">
          <div className="stat">7</div>
          <div className="stat-sub">Shipments</div>
        </div>
      </div>
    </div>
  );
}
