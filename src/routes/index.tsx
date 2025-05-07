import { memo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@components/UI/LoadingSpinner";

// Ленивая загрузка компонентов
const Calculator = lazy(() => import("../components/Calculator/Calculator"));
// const Characteristics = lazy(() => import("@components/Calculator/Characteristics/Characteristics"));
const Talents = lazy(() => import("@components/Calculator/Talents/Talents"));


const AppRoutes = memo(() => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/n-blade-calculator/calculator"  element={<Calculator />}>
          {/* <Route path="characteristics" element={<Characteristics />} /> */}
          <Route path="talents" element={<Talents />} />
          <Route index element={<Navigate to="talents" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/n-blade-calculator/calculator" replace />} />
      </Routes>
    </Suspense>
  );
});

AppRoutes.displayName = 'AppRoutes';
export default AppRoutes;