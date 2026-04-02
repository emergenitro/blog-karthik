import { ImageResponse } from 'next/og';

export const runtime = 'edge';

async function loadFont(family, weight) {
    const css = await fetch(
        `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) throw new Error('Could not parse font URL');
    return fetch(url).then((r) => r.arrayBuffer());
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') ?? "Karthik's Blog";
    const description = searchParams.get('description') ?? '';

    const [regular, bold] = await Promise.all([
        loadFont('Space+Grotesk', 400),
        loadFont('Space+Grotesk', 700),
    ]);

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    padding: '80px',
                    fontFamily: 'Space Grotesk',
                }}
            >
                <div
                    style={{
                        fontSize: '18px',
                        color: '#6b7280',
                        marginBottom: '24px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 400,
                    }}
                >
                    karthik's blog
                </div>
                <div
                    style={{
                        fontSize: title.length > 60 ? '48px' : '64px',
                        fontWeight: 700,
                        color: '#f9fafb',
                        lineHeight: 1.1,
                        marginBottom: '32px',
                        maxWidth: '900px',
                    }}
                >
                    {title}
                </div>
                {description && (
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 400,
                            color: '#9ca3af',
                            lineHeight: 1.5,
                            maxWidth: '800px',
                        }}
                    >
                        {description.length > 120 ? description.slice(0, 120) + '…' : description}
                    </div>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                { name: 'Space Grotesk', data: regular, weight: 400 },
                { name: 'Space Grotesk', data: bold, weight: 700 },
            ],
        }
    );
}
