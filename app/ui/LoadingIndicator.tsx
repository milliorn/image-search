/** Renders a centered bar spinner while data is being fetched. */

"use client";

import { BarLoader } from "react-spinners";
import type { LoadingIndicatorProps } from "../models/UIComponentProps";

/** Passes optional color and height to BarLoader only when they are defined. */
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
