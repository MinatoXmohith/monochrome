import { Icon } from '../ui/Icon';
import { icons } from '../ui/icons';

export function HomePage() {
    return (
        <>
            <div aria-label="Home views" className="home-header-tabs" role="tablist">
                <button aria-selected="true" className="home-tab active" data-tab="for-you" role="tab" type="button">
                    Home
                </button>
                <button aria-selected="false" className="home-tab" data-tab="mk-liked" role="tab" type="button">
                    MK liked 🫰🏻
                </button>
            </div>

            <div aria-hidden="false" className="home-view active" id="home-view-for-you" role="tabpanel">
                <div id="home-unreleased" style={{ padding: '0.5rem 0' }} />
            </div>

            <div
                aria-hidden="true"
                className="home-view"
                id="home-view-mk-liked"
                role="tabpanel"
                style={{ display: 'none' }}
            >
                <section className="content-section" style={{ marginTop: 0 }}>
                    <div className="section-header-row">
                        <h2 className="section-title">MK liked 🫰🏻</h2>
                        <button
                            className="btn-primary"
                            id="mk-liked-shuffle-btn"
                            style={{ display: 'none', alignItems: 'center', gap: '8px', padding: '6px 12px' }}
                            title="Shuffle liked songs"
                            type="button"
                        >
                            <Icon svg={icons.shuffle} size={16} />
                            Shuffle
                        </button>
                    </div>
                    <p
                        id="mk-liked-empty"
                        style={{ display: 'none', color: 'var(--muted-foreground)', padding: '2rem 0' }}
                    >
                        No liked songs yet. Tap the heart on any song to add it here.
                    </p>
                    <div className="track-list" id="mk-liked-tracks" />
                </section>
            </div>
        </>
    );
}
