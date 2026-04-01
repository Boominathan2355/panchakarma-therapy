import React from 'react';
import { Lightbulb } from 'lucide-react';
import './DecisionExplainer.css';

export interface DecisionFactor {
    factor: string;
    impact: string;
    description: string;
}

export interface DecisionExplanation {
    decision: string;
    score: number;
    factors: DecisionFactor[];
}

export interface DecisionExplainerProps {
    explanation: DecisionExplanation;
}

const DecisionExplainer: React.FC<DecisionExplainerProps> = ({ explanation }) => {
    if (!explanation) return null;

    return (
        <div className="explainer-card">
            <div className="explainer-header">
                <Lightbulb className="text-primary" size={24} />
                <h3>Decision Intelligence</h3>
            </div>

            <div className="decision-main">
                <h4 className="decision-title">{explanation.decision}</h4>
                <div className="score-badge">Confidence: {explanation.score}%</div>
            </div>

            <div className="factors-list">
                {explanation.factors.map((factor, idx) => (
                    <div key={idx} className="factor-item">
                        <div className="factor-header">
                            <span className="factor-name">{factor.factor}</span>
                            <span className={`factor-impact ${factor.impact.includes('-') ? 'negative' : 'positive'}`}>
                                {factor.impact}
                            </span>
                        </div>
                        <p className="factor-desc">{factor.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DecisionExplainer;
