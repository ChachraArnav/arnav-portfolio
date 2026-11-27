export const MOTION_STORAGE_KEY = "motion";

/**
 * Runs before first paint, alongside the theme script. Resolves the motion
 * preference (saved choice, else the OS "reduce motion" setting) onto
 * <html data-motion>. Kept free of React so the server layout can import it.
 */
export const motionInitScript = `(function(){var d=document.documentElement;try{var m=localStorage.getItem('${MOTION_STORAGE_KEY}');if(m!=='full'&&m!=='reduce'){m=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'reduce':'full'}d.dataset.motion=m}catch(e){d.dataset.motion='full'}})();`;
