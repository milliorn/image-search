"use client";

import { BarLoader } from "react-spinners";
import type { LoadingIndicatorProps } from "../models/UIComponentProps";

/**
 * Renders a loading indicator using the BarLoader component from the react-spinners library.
 *
 * @param props.loading - Indicates whether the loading indicator should be displayed.
 * @param props.color - The color of the loading indicator.
 * @param props.height - The height of the loading indicator.
 */
const LoadingIndicator = ({
  color,
  loading,
  height,
}: LoadingIndicatorProps) => {
  return (
    <div className="flex justify-center items-center">
      <BarLoader
        loading={loading}
        {...(color !== undefined && { color })}
        {...(height !== undefined && { height })}
      />
    </div>
  );
};

export default LoadingIndicator;
