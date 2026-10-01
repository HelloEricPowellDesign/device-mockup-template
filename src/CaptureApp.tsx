import DeviceMockup, {
  EXPORT_SIZES,
  type DeviceSpec,
  type DeviceType,
  type DisplaySize,
} from './components/DeviceMockup';

const DEVICE_TYPES: DeviceType[] = ['iphone', 'ipad', 'macbook', 'desktop'];

function parseSpec(raw: string): DeviceSpec {
  const parts = raw.split('+').map((p) => p.trim()) as DeviceType[];
  if (parts.length === 2 && parts.every((p) => DEVICE_TYPES.includes(p))) {
    return [parts[0], parts[1]];
  }
  if (parts.length === 1 && DEVICE_TYPES.includes(parts[0])) return parts[0];
  return 'ipad';
}

const params = new URLSearchParams(window.location.search);
const size = (params.get('size') === 'card' ? 'card' : 'hero') as DisplaySize;
const devices = parseSpec(params.get('spec') || 'ipad');
const base = EXPORT_SIZES[size];
const dim = {
  w: Number(params.get('w')) || base.w,
  h: Number(params.get('h')) || base.h,
};

/** Capture frames are device-only. Title/description live as HTML over the portfolio hero. */
export default function CaptureApp() {
  return (
    <div
      data-capture-root
      style={{
        width: dim.w,
        height: dim.h,
        margin: 0,
        padding: 0,
        background: '#1f1f22',
        overflow: 'hidden',
      }}
    >
      <DeviceMockup
        devices={devices}
        size={size}
        exportMode
        animVariant={0}
      />
    </div>
  );
}
