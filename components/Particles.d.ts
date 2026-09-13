declare module "./Particles" {
  import * as React from "react";

  type ParticlesProps = {
    particleCount?: number;
    particleSpread?: number;
    speed?: number;
    particleColors?: string[];
    moveParticlesOnHover?: boolean;
    particleHoverFactor?: number;
    alphaParticles?: boolean;
    particleBaseSize?: number;
    sizeRandomness?: number;
    cameraDistance?: number;
    disableRotation?: boolean;
    pixelRatio?: number;
  };

  const Particles: React.FC<ParticlesProps>;
  export default Particles;
}
