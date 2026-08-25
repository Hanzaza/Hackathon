import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  return (
    <>
      <ParallaxComponent />
      <div className="osmo-credits py-8 text-center text-slate-500 text-sm">
        <p className="osmo-credits__p">
          Resource by <a target="_blank" rel="noopener noreferrer" href="https://www.osmo.supply/" className="osmo-credits__p-a text-purple-600 hover:underline">Osmo</a>
        </p>
      </div>
    </>
  );
}
