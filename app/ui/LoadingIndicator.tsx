"use client";

import { BarLoader } from "react-spinners";

type LoadingIndicatorProps = {
  loading: boolean;
  color?: string;
  height?: number;
};

const LoadingIndicator = ({
  color,
  loading,
  height,
}: LoadingIndicatorProps) => {
  return (
    <div className="flex justify-center items-center">
      <BarLoader color={color} loading={loading} height={height} />
    </div>
  );
};

export default LoadingIndicator;
