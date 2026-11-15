import { Icon } from '../ui/Icon';
import { icons } from '../ui/icons';
import type { ComponentChildren } from 'preact';

function RefreshButton({ id, label = 'Refresh' }: { id: string; label?: string }) {
    return (
        <button aria-label={label} className="btn-secondary home-section-action" id={id} title={label} type="button">
            <Icon svg={label === 'Clear history' ? icons.trash : icons.rotateCw} size={16} />
        </button>
    );
}

function HomeSection({
    children,
    title,
    action,
}: {
    children: ComponentChildren;
    title: string;
    action?: ComponentChildren;
}) {
    return (
        <section className="content-section">
            <div className="section-header-row home-section-header">
                <h2 className="section-title">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}

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
                <div className="home-welcome" id="home-welcome" style={{ display: 'none' }}>
                    <h1>Welcome to MKPlayer</h1>
                    <p>You haven't listened to anything yet. Search for your favorite songs to get started.</p>
                </div>

                <div id="home-content" style={{ display: 'none' }}>
                    <HomeSection
                        action={
                            <div className="home-section-actions">
                                <button
                                    className="btn-primary"
                                    id="home-start-infinite-radio-btn"
                                    title="Start infinite radio"
                                    type="button"
                                >
                                    <Icon svg={icons.radio} size={16} />
                                    Start radio
                                </button>
                                <RefreshButton id="refresh-songs-btn" />
                            </div>
                        }
                        title="Recommended songs"
                    >
                        <div className="track-list" id="home-recommended-songs" />
                    </HomeSection>

                    <HomeSection action={<RefreshButton id="refresh-albums-btn" />} title="Recommended albums">
                        <div className="card-grid" id="home-recommended-albums" />
                    </HomeSection>

                    <HomeSection action={<RefreshButton id="refresh-artists-btn" />} title="Recommended artists">
                        <div className="card-grid" id="home-recommended-artists" />
                    </HomeSection>

                    <HomeSection
                        action={<RefreshButton id="clear-recent-btn" label="Clear history" />}
                        title="Jump back in"
                    >
                        <div className="card-grid" id="home-recent-mixed" />
                    </HomeSection>
                </div>
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
