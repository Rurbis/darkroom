import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Spike S-4 (#21): defaults only. The tag cache for revalidateTag is measured
// in the full spike, once the pages that use it exist (#19, #20).
export default defineCloudflareConfig();
