import {Config} from '@remotion/cli/config';
// Use the pre-installed Chromium in cloud sessions when present.
import {existsSync} from 'fs';
if (existsSync('/opt/pw-browsers/chromium')) {
  Config.setBrowserExecutable('/opt/pw-browsers/chromium');
}
