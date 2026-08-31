/**
 * src/ui/screens/SimulatorScreen.tsx
 *
 * Salvo Recovery Simulator / Scenario Lab
 * Connects directly to POST /api/demo/recovery
 */
import React, { useState, useCallback } from 'react';
import { SalvoApi, SalvoApiError } from '../lib/api.js';
import type { RecoverySessionResult } from '../../types/index.js';
import {
  SimulatorHeader,
  ScenarioSelector,
  ScenarioContextCard,
  SimulationPipeline,
  SimulationResultCard,
  ScenarioComparisonTable,
  type DemoScenarioName,
} from '../components/simulator/index.js';
import { Card } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { AlertCircle, FlaskConical } from 'lucide-react';

export interface SimulatorScreenProps {
  onNavigate?: (route: string) => void;
  initialScenario?: DemoScenarioName;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({
  initialScenario = 'success',
}) => {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenarioName>(initialScenario);
  const [sessionResult, setSessionResult] = useState<RecoverySessionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Run simulation via POST /api/demo/recovery
  const runSimulation = useCallback(async (scenarioToRun: DemoScenarioName) => {
    setIsSimulating(true);
    setErrorMessage(null);
    setSessionResult(null);

    try {
      const res = await SalvoApi.runDemo(scenarioToRun);
      if (res.success && res.recoverySession) {
        setSessionResult(res.recoverySession);
      } else {
        setErrorMessage('Simulation completed with unexpected format.');
      }
    } catch (err: unknown) {
      if (err instanceof SalvoApiError) {
        setErrorMessage(`Simulation Error: ${err.message}`);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to execute recovery simulation.');
      }
    } finally {
      setIsSimulating(false);
    }
  }, []);

  // Handle scenario switch
  const handleSelectScenario = (scenario: DemoScenarioName) => {
    setSelectedScenario(scenario);
    setSessionResult(null);
    setErrorMessage(null);
  };

  // Reset lab
  const handleReset = () => {
    setSessionResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header */}
      <SimulatorHeader onReset={handleReset} isSimulating={isSimulating} />

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-[16px] bg-risk/10 border border-risk/40 text-risk text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-sans font-medium">{errorMessage}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => runSimulation(selectedScenario)}
            className="h-7 text-xs border-risk/40 hover:bg-risk/20 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 2. Scenario Library (6 Archetypes) */}
      <ScenarioSelector
        selectedScenario={selectedScenario}
        onSelect={handleSelectScenario}
        isSimulating={isSimulating}
      />

      {/* 3. Selected Scenario Context & Controls */}
      <ScenarioContextCard
        scenario={selectedScenario}
        onRunSimulation={() => runSimulation(selectedScenario)}
        onReset={handleReset}
        isSimulating={isSimulating}
      />

      {/* 4. Live Pipeline Visualization */}
      <SimulationPipeline
        sessionResult={sessionResult}
        isSimulating={isSimulating}
      />

      {/* 5. In-Progress Simulation Skeleton */}
      {isSimulating && (
        <Card className="border-border-hairline bg-[#020626]/95 p-8 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-[14px] bg-caution/20 border border-caution/40 flex items-center justify-center text-caution mx-auto">
            <FlaskConical className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-sans">
              Executing Deterministic Autonomous Recovery Session...
            </h3>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Observing Failure &rarr; LLM Reasoning &rarr; Policy Verification &rarr; Razorpay Test Dispatch
            </p>
          </div>
          <Skeleton className="h-32 rounded-[14px]" />
        </Card>
      )}

      {/* 6. Simulation Results Ledger */}
      {sessionResult && !isSimulating && (
        <div className="animate-fadeIn">
          <SimulationResultCard sessionResult={sessionResult} />
        </div>
      )}

      {/* 7. Scenario Matrix Comparison Table */}
      <ScenarioComparisonTable onSelectScenario={handleSelectScenario} />
    </div>
  );
};

export default SimulatorScreen;
