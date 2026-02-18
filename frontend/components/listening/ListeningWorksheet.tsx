import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ListeningWorksheetProps {
    test: any;
    answers: Record<number, string>;
    handleAnswerChange: (questionId: number, answer: string) => void;
    result: any;
}

const ListeningWorksheet: React.FC<ListeningWorksheetProps> = ({
    test,
    answers,
    handleAnswerChange,
    result
}) => {
    // Helper to render a blank input field with question number

    // Helper to render a blank input field with question number
    // Helper to render a blank input field with question number
    const renderBlank = (questionId: number, width: string = "w-32", showNumber: boolean = true, variant: 'box' | 'line' = 'line') => {
        const isCorrect = result?.correctAnswers?.[questionId]?.toLowerCase() === answers[questionId]?.toLowerCase();

        return (
            <span className="inline-flex items-center mx-1 align-middle space-x-1 relative">
                {/* Question Number Box */}
                {/* Question Number Box */}
                {showNumber && (
                    <span className="flex items-center justify-center w-6 h-6 text-slate-700 text-base font-bold font-serif shrink-0">
                        {questionId}
                    </span>
                )}

                {/* Input Field */}
                <div className="relative">
                    <input
                        type="text"
                        value={answers[questionId] || ''}
                        onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                        disabled={!!result}
                        className={`
                            outline-none px-2 py-0.5 h-7 ${width} text-lg font-serif
                            ${variant === 'line'
                                ? 'border-b border-black bg-transparent'
                                : 'border border-slate-300 bg-white'
                            }
                            ${result
                                ? isCorrect
                                    ? 'text-green-700 font-bold border-green-500 bg-green-50'
                                    : 'text-red-700 font-bold border-red-500 bg-red-50'
                                : variant === 'line'
                                    ? 'focus:border-black'
                                    : 'focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                            }
                        `}
                    />
                    {result && !isCorrect && (
                        <div className="absolute top-full left-0 mt-1 z-10">
                            <span className="text-xs text-white bg-green-600 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                                {result.correctAnswers[questionId]}
                            </span>
                        </div>
                    )}
                </div>
            </span>
        );
    };

    // Pagination State
    const [activePart, setActivePart] = useState<number>(1);

    // Helpers for Multi-Select (Pick Two)
    const handleMultiSelect = (qId1: number, qId2: number, option: string) => {
        // Get current selections for this pair
        const currentSelection1 = answers[qId1] || "";
        const currentSelection2 = answers[qId2] || "";

        // Combine into a set
        const selected = new Set<string>();
        if (currentSelection1) selected.add(currentSelection1);
        if (currentSelection2) selected.add(currentSelection2);

        // Toggle logic
        if (selected.has(option)) {
            selected.delete(option);
        } else {
            if (selected.size < 2) {
                selected.add(option);
            } else {
                // Already have 2, don't add more (or could replace oldest? keeping simple: strict limit)
                return;
            }
        }

        // Sort and assign back to qId1 (first) and qId2 (second) alphabetically
        // This ensures if user picks D then B, we save Q21=B, Q22=D
        const sorted = Array.from(selected).sort();

        handleAnswerChange(qId1, sorted[0] || "");
        handleAnswerChange(qId2, sorted[1] || "");
    };

    const renderPickTwo = (question1: any, question2: any) => {
        if (!question1 || !question2) return null;

        // Flatten options (assuming both have same options)
        const options = question1.options;

        return (
            <div className="mb-8 border-b border-dotted border-slate-300 pb-6">
                <div className="mb-4">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="italic text-lg font-medium">Questions {question1.questionNumber} and {question2.questionNumber}</span>
                    </div>
                    <p className="font-medium text-lg leading-relaxed font-serif">{question1.question}</p>
                </div>

                <div className="space-y-3 ml-4">
                    {options.map((optString: string) => {
                        const letter = optString.charAt(0); // "A"
                        const text = optString.replace(/^[A-Z][\.\)\s]*/, '').trim();

                        // Check if this letter is selected in EITHER answer slot
                        const isSelected = answers[question1.id] === letter || answers[question2.id] === letter;

                        let optionClass = "flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all hover:bg-slate-50";

                        if (!result) {
                            if (isSelected) optionClass += " border-purple-500 bg-purple-50 ring-1 ring-purple-500";
                            else optionClass += " border-transparent";
                        } else {
                            // Result Mode
                            const correct1 = result.correctAnswers[question1.id];
                            const correct2 = result.correctAnswers[question2.id];
                            const isCorrect = letter === correct1 || letter === correct2;

                            if (isCorrect) {
                                optionClass += " border-green-500 bg-green-50 text-green-700 font-medium";
                            } else if (isSelected && !isCorrect) {
                                optionClass += " border-red-500 bg-red-50 text-red-700";
                            } else {
                                optionClass += " border-transparent opacity-60";
                            }
                        }

                        return (
                            <div
                                key={letter}
                                onClick={() => !result && handleMultiSelect(question1.id, question2.id, letter)}
                                className={optionClass}
                            >
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold font-serif shrink-0 transition-colors
                                    ${isSelected || (result && (letter === result.correctAnswers[question1.id] || letter === result.correctAnswers[question2.id]))
                                        ? 'border-current bg-purple-100 text-purple-700'
                                        : 'border-slate-400 text-slate-500'
                                    }
                                    ${result && (letter === result.correctAnswers[question1.id] || letter === result.correctAnswers[question2.id]) ? 'bg-green-100 border-green-500 text-green-700' : ''}
                                    ${result && isSelected && !(letter === result.correctAnswers[question1.id] || letter === result.correctAnswers[question2.id]) ? 'bg-red-100 border-red-500 text-red-700' : ''}
                                `}>
                                    {letter}
                                </span>
                                <span className="text-lg font-serif">{text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

    // 1. Multiple Choice Questions (Standard)
    const renderMultipleChoice = (question: any) => {
        const isAnswered = answers[question.id];

        return (
            <div key={question.id} className="mb-8">
                <div className="flex gap-4 mb-4">
                    <span className="font-bold text-lg min-w-[24px]">{question.questionNumber}</span>
                    <p className="font-medium text-lg leading-relaxed font-serif">{question.question}</p>
                </div>
                <div className="ml-10 space-y-3">
                    {question.options.map((option: string) => {
                        const letter = option.charAt(0);
                        const isSelected = answers[question.id] === letter;

                        let optionClass = "flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all hover:bg-slate-50";
                        if (!result) {
                            if (isSelected) optionClass += " border-purple-500 bg-purple-50 ring-1 ring-purple-500";
                            else optionClass += " border-transparent";
                        } else {
                            const correctLetter = result.correctAnswers[question.id];
                            if (letter === correctLetter) optionClass += " border-green-500 bg-green-50 text-green-700 font-medium";
                            else if (isSelected && letter !== correctLetter) optionClass += " border-red-500 bg-red-50 text-red-700";
                            else optionClass += " border-transparent opacity-60";
                        }

                        return (
                            <div key={option} onClick={() => !result && handleAnswerChange(question.id, letter)} className={optionClass}>
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold font-serif shrink-0 transition-colors
                                    ${isSelected || (result && letter === result.correctAnswers[question.id]) ? 'border-current' : 'border-slate-400 text-slate-500'}`}>
                                    {letter}
                                </span>
                                <span className="text-lg font-serif">{option.replace(/^[A-Z][\.\)\s]*/, '').trim()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // 2. Matching Questions
    // 2. Matching Questions
    const renderMatching = (questions: any[], options: any[], title: string, instruction: string, questionsTitle?: string) => {
        return (
            <div className="mb-12">
                <div className="flex items-baseline justify-between mb-4">
                    <span className="italic text-lg font-medium">Questions {questions[0].questionNumber}–{questions[questions.length - 1].questionNumber}</span>
                </div>
                {instruction.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">{line}</p>
                ))}

                {/* Options Box */}
                <div className="border border-black p-5 mb-8 max-w-2xl mx-auto bg-slate-50/50">
                    <h3 className="text-center font-bold mb-4 uppercase tracking-wider">{title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {options.map((opt: any) => (
                            <div key={opt.letter} className="flex gap-3">
                                <span className="font-bold w-4 font-serif">{opt.letter}</span>
                                <span className="font-serif">{opt.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-lg mb-4 uppercase tracking-wider border-b border-black inline-block font-serif">{questionsTitle || title}</h4>
                    {questions.map(q => (
                        <div key={q.id} className="flex items-center justify-between max-w-2xl border-b border-dotted border-slate-300 pb-2">
                            <div className="flex gap-3 items-center">
                                <span className="font-bold w-3 font-serif">{q.questionNumber}</span>
                                <span className="font-serif">{q.question.replace(/.*?\(/, '').replace(/\)$/, '')}</span>
                            </div>
                            <div className="ml-4">
                                {renderBlank(q.id, "w-16", false)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 5. Sentence Completion / Short Answer
    const renderCompletion = (instruction: string, content: React.ReactNode) => {
        return (
            <div className="mb-12 animate-in fade-in duration-300">
                <p className="italic mb-2">{instruction.split('\n')[0]}</p>
                {instruction.includes('\n') && <p className="italic mb-6" dangerouslySetInnerHTML={{ __html: instruction.split('\n')[1] }} />}

                <div className="border border-black p-8 bg-white shadow-sm">
                    {content}
                </div>
            </div>
        );
    };

    // 3. Plan/Map/Diagram Labelling
    const renderMapDiagram = (imageUrl: string, questions: any[], options?: any[]) => {
        return (
            <div className="mb-12 animate-in fade-in duration-300">
                <p className="instruction mb-4 italic">Label the map/diagram. Write the correct letter, A–I.</p>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 w-full relative group">
                        <img src={imageUrl} alt="IELTS Diagram" className="w-full h-auto border border-slate-300 rounded shadow-sm group-hover:shadow-md transition-shadow" />
                    </div>
                    <div className="w-full md:w-1/3 shrink-0">
                        <div className="space-y-6">
                            {questions.map(q => (
                                <div key={q.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold w-6 text-slate-700">{q.questionNumber}</span>
                                        <span className="text-base font-medium">{q.question}</span>
                                    </div>
                                    <div className="ml-4">{renderBlank(q.id, "w-16", false)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {options && (
                    <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-sm font-semibold mb-2 uppercase tracking-wide">Options List:</p>
                        <p className="text-slate-700 leading-relaxed">
                            {options.map((opt, i) => (
                                <span key={opt.letter}>
                                    <strong>{opt.letter}</strong> {opt.text}
                                    {i < options.length - 1 ? <span className="mx-3 opacity-30">|</span> : ""}
                                </span>
                            ))}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // 4. Table Completion (Generic)
    const renderTableWrap = (headers: string[], rows: any[][]) => {
        return (
            <div className="mb-12 overflow-x-auto">
                <table className="w-full border-collapse border border-black text-sm md:text-base bg-white">
                    <thead>
                        <tr className="bg-slate-50">
                            {headers.map((h, i) => (
                                <th key={i} className={`border border-black p-3 font-bold uppercase tracking-wider ${i < headers.length - 1 ? 'border-r' : ''}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex < rows.length - 1 ? 'border-b border-black' : ''}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className={`border border-black p-4 ${cellIndex < row.length - 1 ? 'border-r' : ''}`}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="relative pb-24">
            {/* Pagination Tabs */}
            <div className="flex justify-center mb-6 gap-3">
                <button
                    onClick={() => setActivePart(1)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activePart === 1
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                >
                    Part 1
                </button>
                <button
                    onClick={() => setActivePart(2)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activePart === 2
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                >
                    Part 2
                </button>
                <button
                    onClick={() => setActivePart(3)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activePart === 3
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                >
                    Part 3
                </button>
                <button
                    onClick={() => setActivePart(4)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activePart === 4
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                >
                    Part 4
                </button>
            </div>

            {/* Worksheet Content */}
            <div
                className="bg-white text-black font-serif p-8 w-full shadow-sm border border-slate-200 min-h-[600px] select-text"
            >
                {/* Part 1 Content */}
                {activePart === 1 && (
                    <>
                        {/* Part Header */}
                        <div className="flex items-baseline mb-4">
                            <h2 className="text-xl font-bold mr-4">PART 1</h2>
                            <span className="italic text-lg">Questions 1–10</span>
                        </div>

                        {/* Test 10 Part 1 */}
                        {test.id === 10 && (
                            <div className="animate-in fade-in duration-300">
                                <p className="italic mb-2">Complete the table below.</p>
                                <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                <div className="max-w-4xl mx-auto border-x border-t border-slate-950 mb-12">
                                    <div className="bg-white">
                                        <div className="border-b border-slate-950 p-3 text-center font-bold text-xl uppercase tracking-wider bg-slate-50/30">
                                            Festival information
                                        </div>
                                        <div className="grid grid-cols-[150px_1fr_1fr] font-bold bg-slate-100 border-b border-slate-950">
                                            <div className="p-3 border-r border-slate-950 text-center">Date</div>
                                            <div className="p-3 border-r border-slate-950 text-center">Type of event</div>
                                            <div className="p-3 text-center">Details</div>
                                        </div>
                                        {/* Row 1 */}
                                        <div className="grid grid-cols-[150px_1fr_1fr] border-b border-slate-950">
                                            <div className="p-3 border-r border-slate-950 text-center">17th</div>
                                            <div className="p-3 border-r border-slate-950">a concert</div>
                                            <div className="p-3 text-slate-700">performers from Canada</div>
                                        </div>
                                        {/* Row 2 */}
                                        <div className="grid grid-cols-[150px_1fr_1fr] border-b border-slate-950">
                                            <div className="p-3 border-r border-slate-950 text-center">18th</div>
                                            <div className="p-3 border-r border-slate-950">a ballet</div>
                                            <div className="p-3 flex flex-wrap items-baseline gap-1">
                                                <span>company called</span>
                                                {renderBlank(1, "w-40")}
                                            </div>
                                        </div>
                                        {/* Row 3 */}
                                        <div className="grid grid-cols-[150px_1fr_1fr] border-b border-slate-950">
                                            <div className="p-3 border-r border-slate-950 text-center">19th–20th (afternoon)</div>
                                            <div className="p-3 border-r border-slate-950">a play</div>
                                            <div className="p-3 text-slate-700 space-y-2">
                                                <p>type of play: a comedy called Jemima</p>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>has had a good</span>
                                                    {renderBlank(2, "w-40")}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Row 4 */}
                                        <div className="grid grid-cols-[150px_1fr_1fr] border-b border-slate-950">
                                            <div className="p-3 border-r border-slate-950 text-center">20th (evening)</div>
                                            <div className="p-3 border-r border-slate-950 flex flex-wrap items-baseline gap-1">
                                                <span>a</span>
                                                {renderBlank(3, "w-32")}
                                                <span>show</span>
                                            </div>
                                            <div className="p-3 flex flex-wrap items-baseline gap-1">
                                                <span>show is called</span>
                                                {renderBlank(4, "w-40")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="italic mb-2 text-lg">Questions 5–10</p>
                                <p className="italic mb-2">Complete the notes below.</p>
                                <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                <div className="border border-black p-8 bg-white text-slate-900 font-serif">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold decoration-1">Workshops</h3>
                                        <ul className="list-disc pl-8 space-y-4">
                                            <li>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>Making</span>
                                                    {renderBlank(5, "w-40")}
                                                    <span>food</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>(children only) Making</span>
                                                    {renderBlank(6, "w-40")}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>(adults only) Making toys from</span>
                                                    {renderBlank(7, "w-40")}
                                                    <span>using various tools</span>
                                                </div>
                                            </li>
                                        </ul>

                                        <h3 className="text-xl font-bold decoration-1">Outdoor activities</h3>
                                        <ul className="list-disc pl-8 space-y-4">
                                            <li>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>Swimming in the</span>
                                                    {renderBlank(8, "w-40")}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>Walking in the woods, led by an expert on</span>
                                                    {renderBlank(9, "w-40")}
                                                </div>
                                            </li>
                                        </ul>

                                        <div className="pt-4 border-t border-slate-200">
                                            <div className="flex flex-wrap items-baseline gap-1">
                                                <span>See the festival organiser's</span>
                                                {renderBlank(10, "w-48")}
                                                <span>for more information</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test 12 Part 1 */}
                        {test.id === 12 && (
                            <div className="animate-in fade-in duration-300">
                                <p className="italic mb-2">Complete the form below.</p>
                                <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                <div className="border border-black p-6 md:p-8 bg-white font-serif text-slate-900 max-w-4xl mx-auto shadow-sm">
                                    <h3 className="text-2xl font-bold text-center mb-8 border-b-2 border-slate-800 pb-4 uppercase tracking-wider bg-slate-50/50 py-2">Customer Satisfaction Survey</h3>

                                    {/* Customer details */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-lg mb-4 text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">Customer details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-y-4 gap-x-4 pl-2 md:pl-4">
                                            <div className="font-semibold text-slate-700">Name:</div>
                                            <div>Sophie Bird</div>

                                            <div className="font-semibold text-slate-700 self-center">Occupation:</div>
                                            <div className="flex items-center">
                                                {renderBlank(1, "w-full md:w-64")}
                                            </div>

                                            <div className="font-semibold text-slate-700 self-center">Reason for travel today:</div>
                                            <div className="flex items-center">
                                                {renderBlank(2, "w-full md:w-64")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Journey information */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-lg mb-4 text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">Journey information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-y-4 gap-x-4 pl-2 md:pl-4">
                                            <div className="font-semibold text-slate-700 self-center">Name of station returning to:</div>
                                            <div className="flex items-center">{renderBlank(3, "w-full md:w-64")}</div>

                                            <div className="font-semibold text-slate-700 self-center">Type of ticket purchased:</div>
                                            <div className="flex flex-wrap items-baseline gap-1">
                                                <span>standard</span>
                                                {renderBlank(4, "w-32")}
                                                <span>ticket</span>
                                            </div>

                                            <div className="font-semibold text-slate-700 self-center">Cost of ticket:</div>
                                            <div className="flex items-center">
                                                <span className="font-bold mr-1">£</span>
                                                {renderBlank(5, "w-24")}
                                            </div>

                                            <div className="font-semibold text-slate-700">When ticket was purchased:</div>
                                            <div>yesterday</div>

                                            <div className="font-semibold text-slate-700 self-center">Where ticket was bought:</div>
                                            <div className="flex items-center">{renderBlank(6, "w-full md:w-64")}</div>
                                        </div>
                                    </div>

                                    {/* Satisfaction with journey */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-lg mb-4 text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">Satisfaction with journey</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-y-4 gap-x-4 pl-2 md:pl-4">
                                            <div className="font-semibold text-slate-700">Most satisfied with:</div>
                                            <div>the wifi</div>

                                            <div className="font-semibold text-slate-700 self-center">Least satisfied with:</div>
                                            <div className="flex flex-wrap items-baseline gap-1">
                                                <span>the</span>
                                                {renderBlank(7, "w-full md:w-48")}
                                                <span>this morning</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Satisfaction with station facilities */}
                                    <div className="mb-0">
                                        <h4 className="font-bold text-lg mb-4 text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">Satisfaction with station facilities</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-y-4 gap-x-4 pl-2 md:pl-4">
                                            <div className="font-semibold text-slate-700 self-center">Most satisfied with:</div>
                                            <div className="flex flex-wrap items-baseline gap-1">
                                                <span>how much</span>
                                                {renderBlank(8, "w-40")}
                                                <span>was provided</span>
                                            </div>

                                            <div className="font-semibold text-slate-700 self-center">Least satisfied with:</div>
                                            <div className="flex flex-wrap items-baseline gap-1">
                                                <span>lack of seats, particularly on the</span>
                                                {renderBlank(9, "w-48")}
                                            </div>

                                            <div className="font-semibold text-slate-700 self-center">Neither satisfied nor dissatisfied with:</div>
                                            <div className="flex flex-wrap items-baseline gap-1">
                                                <span>the</span>
                                                {renderBlank(10, "w-48")}
                                                <span>available</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Test 13 */}
                        {test.id === 13 && (
                            <div className="animate-in fade-in duration-300">
                                {activePart === 1 && (
                                    <>
                                        <p className="italic mb-2">Complete the notes below.</p>
                                        <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                        <div className="border border-black p-8 bg-white text-slate-900 font-serif max-w-4xl mx-auto shadow-sm">
                                            <h3 className="text-2xl font-bold text-center mb-8 border-b-2 border-slate-800 pb-4 uppercase tracking-wider">Children's Engineering Workshops</h3>

                                            <div className="space-y-8">
                                                {/* Tiny Engineers */}
                                                <section>
                                                    <h4 className="text-xl font-bold mb-4">Tiny Engineers (ages 4–5)</h4>
                                                    <p className="font-bold mb-2">Activities</p>
                                                    <ul className="list-disc pl-8 space-y-4">
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Create a cover for an</span>
                                                                {renderBlank(1, "w-48")}
                                                                <span>so they can drop it from a height without breaking it.</span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Take part in a competition to build the tallest</span>
                                                                {renderBlank(2, "w-48")}
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Make a</span>
                                                                {renderBlank(3, "w-40")}
                                                                <span>powered by a balloon.</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </section>

                                                {/* Junior Engineers */}
                                                <section>
                                                    <h4 className="text-xl font-bold mb-4">Junior Engineers (ages 6–8)</h4>
                                                    <p className="font-bold mb-2">Activities:</p>
                                                    <ul className="list-disc pl-8 space-y-4">
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Build model cars, trucks and</span>
                                                                {renderBlank(4, "w-48")}
                                                                <span>and learn how to program them so they can move.</span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Take part in a competition to build the longest</span>
                                                                {renderBlank(5, "w-48")}
                                                                <span>using card and wood.</span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Create a short</span>
                                                                {renderBlank(6, "w-48")}
                                                                <span>with special software.</span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Build,</span>
                                                                {renderBlank(7, "w-40")}
                                                                <span>and program a humanoid robot.</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </section>

                                                {/* Cost and Time */}
                                                <section className="pt-4 border-t border-slate-200">
                                                    <p className="mb-2">Cost for a five-week block: £50</p>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Held on</span>
                                                        {renderBlank(8, "w-48")}
                                                        <span>from 10 am to 11 am</span>
                                                    </div>
                                                </section>

                                                {/* Location */}
                                                <section>
                                                    <h4 className="font-bold text-lg mb-2">Location</h4>
                                                    <div className="flex flex-wrap items-baseline gap-1 mb-2">
                                                        <span>Building 10A,</span>
                                                        {renderBlank(9, "w-48")}
                                                        <span>Industrial Estate, Grasford</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Plenty of</span>
                                                        {renderBlank(10, "w-48")}
                                                        <span>is available.</span>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {(activePart as number) === 2 && (
                                    <div className="animate-in fade-in duration-300">
                                        <section className="mb-12">
                                            <p className="italic mb-2">Questions 11–14</p>
                                            <p className="italic mb-6">Choose the correct letter, <strong>A</strong>, <strong>B</strong> or <strong>C</strong>.</p>

                                            <div className="space-y-8 max-w-2xl mx-auto">
                                                {test.questions.filter((q: any) => q.questionNumber >= 11 && q.questionNumber <= 14).map((q: any) => (
                                                    <div key={q.id}>
                                                        {renderMultipleChoice(q)}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="pt-8 border-t border-slate-200">
                                            <p className="italic mb-2">Questions 15–20</p>
                                            <p className="italic mb-4">Label the map below.</p>
                                            <p className="italic mb-6">Write the correct letter, <strong>A–H</strong>, next to Questions 15–20.</p>

                                            <div className="border border-black p-8 bg-white text-slate-900 font-serif max-w-5xl mx-auto shadow-sm overflow-hidden">
                                                <h3 className="text-2xl font-bold text-center mb-8 border-b-2 border-slate-800 pb-4 uppercase tracking-wider">Plan of Stevenson&apos;s site</h3>

                                                {renderMapDiagram(
                                                    "/images/test-13-map.png?v=2",
                                                    test.questions.filter((q: any) => q.questionNumber >= 15 && q.questionNumber <= 20)
                                                )}
                                            </div>
                                        </section>


                                    </div>
                                )}
                            </div>
                        )}

                        {/* Test 9 Part 1 - Standalone Block */}
                        {activePart === 1 && test.id === 9 && (
                            <div className="animate-in fade-in duration-300">

                                <p className="italic mb-2">Complete the notes below.</p>
                                <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                <div className="border border-black p-8 bg-white text-slate-900 font-serif">
                                    <h3 className="text-2xl font-bold text-center mb-6 border-b border-black pb-4">Bankside Recruitment Agency</h3>

                                    <div className="space-y-6">
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li className="pl-2">
                                                <span className="font-bold">Address of agency:</span> 497 Eastside, Docklands
                                            </li>
                                            <li className="pl-2">
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span className="font-bold">Name of agent:</span>
                                                    <span>Becky</span>
                                                    {renderBlank(1, "w-40")}
                                                </div>
                                            </li>
                                            <li className="pl-2">
                                                <span className="font-bold">Phone number:</span> 07866 510333
                                            </li>
                                            <li className="pl-2">
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span className="font-bold">Best to call her in the</span>
                                                    {renderBlank(2, "w-40")}
                                                </div>
                                            </li>
                                        </ul>

                                        <div>
                                            <h4 className="font-bold text-lg mb-2">Typical jobs</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li className="pl-2">Clerical and admin roles, mainly in the finance industry</li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Must have good</span>
                                                        {renderBlank(3, "w-40")}
                                                        <span>skills</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Jobs are usually for at least one</span>
                                                        {renderBlank(4, "w-40")}
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Pay is usually</span>
                                                        <span className="font-bold">£</span>
                                                        {renderBlank(5, "w-32")}
                                                        <span>per hour</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-lg mb-2">Registration process</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Wear a</span>
                                                        {renderBlank(6, "w-40")}
                                                        <span>to the interview</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Must bring your</span>
                                                        {renderBlank(7, "w-40")}
                                                        <span>to the interview</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>They will ask questions about each applicant's</span>
                                                        {renderBlank(8, "w-40")}
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-lg mb-2">Advantages of using an agency</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>The</span>
                                                        {renderBlank(9, "w-40")}
                                                        <span>you receive at interview will benefit you</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">Will get access to vacancies which are not advertised</li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Less</span>
                                                        {renderBlank(10, "w-40")}
                                                        <span>is involved in applying for jobs</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Test 9 Part 2 */}


                        {/* Test 5 Part 1 */}
                        {test.id === 1 && (
                            <div className="animate-in fade-in duration-300">
                                <p className="italic mb-2">Questions 1–6</p>
                                <p className="italic mb-2">Complete the notes below.</p>
                                <p className="italic mb-6">
                                    Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
                                </p>

                                <div className="border border-slate-800 p-8 pt-4 bg-white shadow-sm max-w-3xl mx-auto">
                                    <h3 className="text-2xl font-bold text-center mb-8 text-slate-700">Local food shops</h3>

                                    <div className="space-y-8">
                                        {/* Where to go Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Where to go</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>Kite Place – near the</span>
                                                        {renderBlank(10, "w-48")}
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Fish market Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Fish market</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>cross the</span>
                                                        {renderBlank(9, "w-64")}
                                                        <span>and turn right</span>
                                                    </div>
                                                </li>
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>best to go before</span>
                                                        {renderBlank(8, "w-28")}
                                                        <span>pm, earlier than closing time</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Organic shop Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Organic shop</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>called '</span>
                                                        {renderBlank(7, "w-40")}
                                                        <span>'</span>
                                                    </div>
                                                </li>
                                                <li className="text-lg text-slate-600">below a restaurant in the large, grey building</li>
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>look for the large</span>
                                                        {renderBlank(6, "w-44")}
                                                        <span>outside</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Supermarket Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Supermarket</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>take a</span>
                                                        {renderBlank(5, "w-28")}
                                                        <span>minibus, number 289</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <p className="italic mb-2">Questions 7–10</p>
                                    <p className="italic mb-2">Complete the table below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD ONLY</strong> for each answer.
                                    </p>

                                    <div className="max-w-4xl mx-auto border-x border-t border-slate-950">
                                        <div className="bg-white">
                                            <div className="border-b border-slate-950 p-3 text-center font-bold text-xl uppercase tracking-wider bg-slate-50/30">
                                                Shopping
                                            </div>
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 font-bold text-lg bg-slate-50/30">
                                                <div className="p-4 border-r border-slate-950"></div>
                                                <div className="p-4 border-r border-slate-950 text-center">To buy</div>
                                                <div className="p-4 text-center">Other ideas</div>
                                            </div>

                                            {/* Fish market Row */}
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 text-lg">
                                                <div className="p-4 border-r border-slate-950 font-bold">Fish market</div>
                                                <div className="p-4 border-r border-slate-950">a dozen prawns</div>
                                                <div className="p-4">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>a handful of</span>
                                                        {renderBlank(4, "w-32")}
                                                        <span>(type of seaweed)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Organic shop Row */}
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 text-lg">
                                                <div className="p-4 border-r border-slate-950 font-bold">Organic shop</div>
                                                <div className="p-4 border-r border-slate-950">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>beans and a</span>
                                                        {renderBlank(3, "w-32")}
                                                        <span>for dessert</span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>spices and</span>
                                                        {renderBlank(2, "w-32")}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bakery Row */}
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 text-lg">
                                                <div className="p-4 border-r border-slate-950 font-bold">Bakery</div>
                                                <div className="p-4 border-r border-slate-950">a brown loaf</div>
                                                <div className="p-4">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>a</span>
                                                        {renderBlank(1, "w-32")}
                                                        <span>tart</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )} {test.id === 2 && (
                            <>
                                {renderCompletion(
                                    "Complete the form below.\nWrite <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.",
                                    <div className="max-w-2xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-8 tracking-wide">Guitar Group</h3>
                                        <div className="space-y-6 ml-4">
                                            {[
                                                { label: "Coordinator:", content: <><span className="text-lg">Gary</span>{renderBlank(1, "w-40")}</> },
                                                { label: "Level:", content: renderBlank(2, "w-48") },
                                                { label: "Place:", content: <><span className="text-lg">the</span>{renderBlank(3, "w-48")}</> },
                                                { label: "Address:", content: <>{renderBlank(4, "w-40")}<span className="text-lg font-medium">Street</span></> },
                                                { label: "Time:", content: <><span className="text-lg">Thursday morning at</span>{renderBlank(5, "w-32")}</> },
                                                { label: "Recommended website:", content: <><span className="text-lg">'The perfect</span>{renderBlank(6, "w-32")}<span className="text-lg">'</span></> }
                                            ].map((row, i) => (
                                                <div key={i} className="flex items-baseline gap-2">
                                                    <span className="text-lg font-medium min-w-[120px]">{row.label}</span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        {row.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>

                                )}

                                <p className="italic mb-6">
                                    Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
                                </p>

                                <div className="border border-slate-800 p-8 pt-4 bg-white shadow-sm max-w-3xl mx-auto">
                                    <h3 className="text-2xl font-bold text-center mb-8 text-slate-700">Local food shops</h3>

                                    <div className="space-y-8">
                                        {/* Where to go Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Where to go</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>Kite Place – near the</span>
                                                        {renderBlank(10, "w-48")}
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Fish market Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Fish market</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>cross the</span>
                                                        {renderBlank(9, "w-64")}
                                                        <span>and turn right</span>
                                                    </div>
                                                </li>
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>best to go before</span>
                                                        {renderBlank(8, "w-28")}
                                                        <span>pm, earlier than closing time</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Organic shop Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Organic shop</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>called '</span>
                                                        {renderBlank(7, "w-40")}
                                                        <span>'</span>
                                                    </div>
                                                </li>
                                                <li className="text-lg text-slate-600">below a restaurant in the large, grey building</li>
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>look for the large</span>
                                                        {renderBlank(6, "w-44")}
                                                        <span>outside</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Supermarket Section */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-lg">Supermarket</h4>
                                            <ul className="list-disc ml-6 space-y-4">
                                                <li className="text-lg">
                                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                                        <span>take a</span>
                                                        {renderBlank(5, "w-28")}
                                                        <span>minibus, number 289</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <p className="italic mb-2">Questions 7–10</p>
                                    <p className="italic mb-2">Complete the table below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD ONLY</strong> for each answer.
                                    </p>

                                    <div className="max-w-4xl mx-auto border-x border-t border-slate-950">
                                        <div className="bg-white">
                                            <div className="border-b border-slate-950 p-3 text-center font-bold text-xl uppercase tracking-wider bg-slate-50/30">
                                                Shopping
                                            </div>
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 font-bold text-lg bg-slate-50/30">
                                                <div className="p-4 border-r border-slate-950"></div>
                                                <div className="p-4 border-r border-slate-950 text-center">To buy</div>
                                                <div className="p-4 text-center">Other ideas</div>
                                            </div>

                                            {/* Fish market Row */}
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 text-lg">
                                                <div className="p-4 border-r border-slate-950 font-bold">Fish market</div>
                                                <div className="p-4 border-r border-slate-950">a dozen prawns</div>
                                                <div className="p-4">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>a handful of</span>
                                                        {renderBlank(4, "w-32")}
                                                        <span>(type of seaweed)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Organic shop Row */}
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 text-lg">
                                                <div className="p-4 border-r border-slate-950 font-bold">Organic shop</div>
                                                <div className="p-4 border-r border-slate-950">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>beans and a</span>
                                                        {renderBlank(3, "w-32")}
                                                        <span>for dessert</span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>spices and</span>
                                                        {renderBlank(2, "w-32")}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bakery Row */}
                                            <div className="grid grid-cols-[1fr_2fr_2fr] border-b border-slate-950 text-lg">
                                                <div className="p-4 border-r border-slate-950 font-bold">Bakery</div>
                                                <div className="p-4 border-r border-slate-950">a brown loaf</div>
                                                <div className="p-4">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>a</span>
                                                        {renderBlank(1, "w-32")}
                                                        <span>tart</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>

                        )} {test.id === 3 && (
                            <div className="animate-in fade-in duration-300">
                                <p className="italic mb-2">Complete the notes below.</p>
                                <p className="italic mb-6">
                                    Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
                                </p>

                                {/* Main Content Box */}
                                <div className="border border-black p-6">
                                    <h3 className="text-xl font-bold text-center mb-6">
                                        Hinchingbrooke Country Park
                                    </h3>

                                    {/* The Park Section */}
                                    <div className="mb-6">
                                        <h4 className="font-bold text-lg mb-3">The park</h4>

                                        <div className="ml-4 space-y-2">
                                            <div className="flex items-baseline flex-wrap">
                                                <span>Area:</span>
                                                {renderBlank(1, "w-24")}
                                                <span>hectares</span>
                                            </div>

                                            <div>Habitats: wetland, grassland and woodland</div>

                                            <div className="flex items-baseline flex-wrap">
                                                <span>Wetland: lakes, ponds and a</span>
                                                {renderBlank(2, "w-28")}
                                            </div>

                                            <div>Wildlife includes birds, insects and animals</div>
                                        </div>
                                    </div>

                                    {/* Subjects Section */}
                                    <div className="mb-6">
                                        <h4 className="font-bold text-lg mb-3">Subjects studied in educational visits include</h4>

                                        <div className="ml-4 space-y-2">
                                            <div className="flex items-baseline flex-wrap">
                                                <span>Science: Children look at</span>
                                                {renderBlank(3, "w-28")}
                                                <span>about plants, etc.</span>
                                            </div>

                                            <div className="flex items-baseline flex-wrap">
                                                <span>Geography: includes learning to use a</span>
                                                {renderBlank(4, "w-24")}
                                                <span>and compass</span>
                                            </div>

                                            <div>History: changes in land use</div>

                                            <div className="flex items-baseline flex-wrap">
                                                <span>Leisure and tourism: mostly concentrates on the park's</span>
                                                {renderBlank(5, "w-28")}
                                            </div>

                                            <div className="flex items-baseline flex-wrap">
                                                <span>Music: Children make</span>
                                                {renderBlank(6, "w-28")}
                                                <span>with natural materials, and experiment with rhythm and speed.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Benefits Section */}
                                    <div className="mb-6">
                                        <h4 className="font-bold text-lg mb-3">Benefits of outdoor educational visits</h4>

                                        <div className="ml-4 space-y-2">
                                            <div className="flex items-baseline flex-wrap">
                                                <span>They give children a feeling of</span>
                                                {renderBlank(7, "w-28")}
                                                <span>that they may not have elsewhere.</span>
                                            </div>

                                            <div className="flex items-baseline flex-wrap">
                                                <span>Children learn new</span>
                                                {renderBlank(8, "w-24")}
                                                <span>and gain self-confidence.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Practical Issues Section */}
                                    <div className="mb-4">
                                        <h4 className="font-bold text-lg mb-3">Practical issues</h4>

                                        <div className="ml-4 space-y-2">
                                            <div className="flex items-baseline flex-wrap">
                                                <span>Cost per child:</span>
                                                {renderBlank(9, "w-20")}
                                                <span>£</span>
                                            </div>

                                            <div className="flex items-baseline flex-wrap">
                                                <span>Adults, such as</span>
                                                {renderBlank(10, "w-28")}
                                                <span>, free</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Test 4 Part 1 */}
                        {/* Test 4 Part 1 */}
                        {activePart === 1 && test.id === 4 && (
                            <div className="animate-in fade-in duration-300">

                                {/* Questions 1-6 */}
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 1–6</p>
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
                                    </p>

                                    <div className="border border-black p-6 bg-white mx-auto max-w-3xl">
                                        <h3 className="text-xl font-bold text-center mb-6 text-black">First day at work</h3>

                                        <div className="space-y-6 ml-4 text-lg">
                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className="min-w-[180px] font-medium">Name of supervisor:</span>
                                                    {renderBlank(1, "w-48", true)}
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className="min-w-[180px] font-medium">Where to leave coat and bag:</span>
                                                    <span>use</span>
                                                    {renderBlank(2, "w-40", true)}
                                                    <span>in staffroom</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full mt-3 shrink-0"></span>
                                                <div className="w-full">
                                                    <span className="font-medium block mb-2">See Tiffany in HR:</span>
                                                    <div className="ml-8 space-y-3">
                                                        <div className="flex items-baseline gap-x-2">
                                                            <span>to give</span>
                                                            {renderBlank(3, "w-40", true)}
                                                            <span>number</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-x-2">
                                                            <span>to collect</span>
                                                            {renderBlank(4, "w-48", true)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className="min-w-[180px] font-medium">Location of HR office:</span>
                                                    <span>on</span>
                                                    {renderBlank(5, "w-32", true)}
                                                    <span>floor</span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className="min-w-[180px] font-medium">Supervisor's mobile number:</span>
                                                    {renderBlank(6, "w-48", true)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions 7-10 */}
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 7–10</p>
                                    <p className="italic mb-2">Complete the table below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD ONLY</strong> for each answer.
                                    </p>

                                    <div className="max-w-5xl mx-auto overflow-x-auto">
                                        <table className="w-full border-collapse border border-black text-base bg-white">
                                            <thead>
                                                <tr>
                                                    <th colSpan={4} className="border border-black p-3 font-bold text-center text-lg uppercase tracking-wider bg-slate-50">
                                                        Responsibilities
                                                    </th>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <th className="border border-black p-3 w-1/5"></th>
                                                    <th className="border border-black p-3 font-bold text-center w-1/4">Task 1</th>
                                                    <th className="border border-black p-3 font-bold text-center w-1/4">Task 2</th>
                                                    <th className="border border-black p-3 font-bold text-center w-1/3">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Bakery Section */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 font-bold bg-slate-50/30">Bakery section</td>
                                                    <td className="border border-black p-4 align-top">Check sell-by dates</td>
                                                    <td className="border border-black p-4 align-top">Change price labels</td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                                <span>Use</span>
                                                                {renderBlank(7, "w-28", true)}
                                                            </div>
                                                            <span>labels</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Sushi Takeaway Section */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 font-bold bg-slate-50/30">Sushi takeaway counter</td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Re-stock with</span>
                                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                                {renderBlank(8, "w-36", true)}
                                                            </div>
                                                            <span>boxes if needed</span>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">Wipe preparation area and clean the sink</td>
                                                    <td className="border border-black p-4 align-top">Do not clean any knives</td>
                                                </tr>
                                                {/* Meat and Fish Counters Section */}
                                                <tr>
                                                    <td className="border border-black p-4 font-bold bg-slate-50/30">Meat and fish counters</td>
                                                    <td className="border border-black p-4 align-top">Clean the serving area, including the weighing scales</td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Collect</span>
                                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                                {renderBlank(9, "w-36", true)}
                                                            </div>
                                                            <span>for the fish from the cold-room</span>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Must wear special</span>
                                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                                {renderBlank(10, "w-36", true)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test 5 Part 1 */}
                        {activePart === 1 && test.id === 5 && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 1–10</p>
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Transport survey</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline mb-4">
                                            <label className="font-medium text-slate-700">Name:</label>
                                            <span className="font-bold text-lg">Sadie Jones</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline mb-4">
                                            <label className="font-medium text-slate-700">Year of birth:</label>
                                            <span className="font-bold text-lg">1991</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline mb-8">
                                            <label className="font-medium text-slate-700">Postcode:</label>
                                            <div className="flex items-center gap-2">
                                                {renderBlank(1, "max-w-xs", true, 'line')}
                                            </div>
                                        </div>

                                        <div className="pt-6 mb-8">
                                            <h4 className="font-bold text-xl mb-6 text-slate-800 pb-2">Travelling by bus</h4>

                                            <div className="space-y-6 ml-2">
                                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline">
                                                    <label className="font-medium text-slate-700">Date of bus journey:</label>
                                                    <div className="flex items-center gap-2">
                                                        {renderBlank(2, "max-w-xs", true, 'line')}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline">
                                                    <label className="font-medium text-slate-700">Reason for trip:</label>
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>shopping and visit to the</span>
                                                        <div className="flex items-center gap-2">
                                                            {renderBlank(3, "w-48", true, 'line')}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline">
                                                    <label className="font-medium text-slate-700">Travelled by bus because cost of</label>
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <div className="flex items-center gap-2">
                                                            {renderBlank(4, "w-40", true, 'line')}
                                                        </div>
                                                        <span>too high</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline">
                                                    <label className="font-medium text-slate-700">Got on bus at</label>
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <div className="flex items-center gap-2">
                                                            {renderBlank(5, "w-48", true, 'line')}
                                                        </div>
                                                        <span>Street</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
                                                    <label className="font-medium text-slate-700 pt-1">Complaints about bus service:</label>
                                                    <div className="space-y-4">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>- bus today was</span>
                                                            <div className="flex items-center gap-2">
                                                                {renderBlank(6, "w-48", true, 'line')}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>- frequency of buses in the</span>
                                                            <div className="flex items-center gap-2">
                                                                {renderBlank(7, "w-48", true, 'line')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 mb-8">
                                            <h4 className="font-bold text-xl mb-6 text-slate-800 pb-2">Travelling by car</h4>
                                            <div className="ml-2 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-baseline">
                                                <label className="font-medium text-slate-700">Goes to the:</label>
                                                <div className="flex flex-wrap items-baseline gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {renderBlank(8, "w-48", true, 'line')}
                                                    </div>
                                                    <span>by car</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 mb-8">
                                            <h4 className="font-bold text-xl mb-6 text-slate-800 pb-2">Travelling by bicycle</h4>
                                            <div className="ml-2 space-y-6">
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className="font-medium text-slate-700 text-lg">Dislikes travelling by bike in the city centre because of the</span>
                                                    <div className="flex items-center gap-2">
                                                        {renderBlank(9, "min-w-[200px] flex-grow", true, 'line')}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className="font-medium text-slate-700 text-lg">Doesn't own a bike because of a lack of</span>
                                                    <div className="flex items-center gap-2">
                                                        {renderBlank(10, "min-w-[200px] flex-grow", true, 'line')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test 6 Part 1 */}
                        {activePart === 1 && test.id === 6 && (
                            <div className="animate-in fade-in duration-300">
                                {/* Questions 1-5 */}
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 1–5</p>
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-3xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">Working at Milo's Restaurants</h3>

                                        <h4 className="font-bold text-lg mb-4 text-slate-800">Benefits</h4>
                                        <div className="space-y-4 ml-4 text-lg mb-8">
                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    {renderBlank(1, "w-40", true, 'line')}
                                                    <span>provided for all staff</span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    {renderBlank(2, "w-40", true, 'line')}
                                                    <span>during weekdays at all Milo's Restaurants</span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    {renderBlank(3, "w-40", true, 'line')}
                                                    <span>provided after midnight</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-lg mb-4 text-slate-800">Person specification</h4>
                                        <div className="space-y-4 ml-4 text-lg">
                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <span>must be prepared to work well in a team</span>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span>must care about maintaining a high standard of</span>
                                                    {renderBlank(4, "w-40", true, 'line')}
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-4">
                                                <span className="min-w-[6px] bg-black h-1.5 w-1.5 rounded-full self-center shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span>must have a qualification in</span>
                                                    {renderBlank(5, "w-40", true, 'line')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions 6-10 */}
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 6–10</p>
                                    <p className="italic mb-2">Complete the table below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                    <div className="max-w-5xl mx-auto overflow-x-auto">
                                        <table className="w-full border-collapse border border-black text-base bg-white">
                                            <thead>
                                                <tr className="bg-slate-50">
                                                    <th className="border border-black p-3 font-bold text-center w-1/5">Location</th>
                                                    <th className="border border-black p-3 font-bold text-center w-1/5">Job title</th>
                                                    <th className="border border-black p-3 font-bold text-center w-[30%]">Responsibilities include</th>
                                                    <th className="border border-black p-3 font-bold text-center w-[30%]">Pay and conditions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Row 1: Breakfast supervisor */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            {renderBlank(6, "w-28", true, 'line')}
                                                            <span>Street</span>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">Breakfast supervisor</td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-4">
                                                            <span>Checking portions, etc. are correct</span>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Making sure</span>
                                                                {renderBlank(7, "w-28", true, 'line')}
                                                                <span>is clean</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Starting salary</span>
                                                                <span>£8</span>
                                                                {renderBlank(8, "w-20", true, 'line')}
                                                                <span>per hour</span>
                                                            </div>
                                                            <span>Start work at 5.30 a.m.</span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Row 2: Junior chef */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 align-top">City Road</td>
                                                    <td className="border border-black p-4 align-top">Junior chef</td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-4">
                                                            <span>Supporting senior chefs</span>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Maintaining stock and organising</span>
                                                                {renderBlank(9, "w-28", true, 'line')}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-col gap-4">
                                                            <span>Annual salary £23,000</span>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>No work on a</span>
                                                                {renderBlank(10, "w-28", true, 'line')}
                                                                <span>once a month</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test 7 Part 1 */}
                        {activePart === 1 && test.id === 7 && (
                            <div className="animate-in fade-in duration-300">
                                {/* Questions 1-4 Form */}
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 1–4</p>
                                    <p className="italic mb-2">Complete the form below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-3xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">Wayside Camera Club membership form</h3>

                                        <div className="space-y-4 ml-4 text-lg">
                                            {/* Name & Email (Static) */}
                                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-2">
                                                <span className="font-semibold">Name:</span>
                                                <span>Dan Green</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-2">
                                                <span className="font-semibold">Email address:</span>
                                                <span>dan1068@market.com</span>
                                            </div>

                                            {/* Address */}
                                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-2 items-baseline">
                                                <span className="font-semibold">Home address:</span>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>52</span>
                                                    {renderBlank(1, "w-40", true, 'line')}
                                                    <span>Street, Peacetown</span>
                                                </div>
                                            </div>

                                            {/* Heard about us */}
                                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-2 items-baseline">
                                                <span className="font-semibold">Heard about us:</span>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span>from a</span>
                                                    {renderBlank(2, "w-40", true, 'line')}
                                                </div>
                                            </div>

                                            {/* Reasons for joining */}
                                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-2 items-baseline">
                                                <span className="font-semibold">Reasons for joining:</span>
                                                <div className="flex flex-col gap-1">
                                                    <span>to enter competitions</span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>to</span>
                                                        {renderBlank(3, "w-40", true, 'line')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Type of membership */}
                                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-2 items-baseline">
                                                <span className="font-semibold">Type of membership:</span>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    {renderBlank(4, "w-40", true, 'line')}
                                                    <span>membership (£30)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions 5-10 Table */}
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 5–10</p>
                                    <p className="italic mb-2">Complete the table below.</p>
                                    <p className="italic mb-6">Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.</p>

                                    <div className="max-w-5xl mx-auto overflow-x-auto">
                                        <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-widest text-slate-800">Photography competitions</h3>
                                        <table className="w-full border-collapse border border-black text-base bg-white">
                                            <thead>
                                                <tr className="bg-slate-50">
                                                    <th className="border border-black p-3 font-bold text-center w-1/3">Title of competition</th>
                                                    <th className="border border-black p-3 font-bold text-center w-1/3">Instructions</th>
                                                    <th className="border border-black p-3 font-bold text-center w-1/3">Feedback to Dan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Row 1 */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1 justify-center">
                                                            <span>'</span>
                                                            {renderBlank(5, "w-32", true, 'line')}
                                                            <span>'</span>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">A scene in the home</td>
                                                    <td className="border border-black p-4 align-top">The picture's composition was not good.</td>
                                                </tr>
                                                {/* Row 2 */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 align-top text-center font-semibold text-lg">'Beautiful Sunsets'</td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>Scene must show some</span>
                                                            {renderBlank(6, "w-32", true, 'line')}
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>The</span>
                                                            {renderBlank(7, "w-32", true, 'line')}
                                                            <span>was wrong.</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Row 3 */}
                                                <tr className="border-b border-black">
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1 justify-center">
                                                            <span>'</span>
                                                            {renderBlank(8, "w-32", true, 'line')}
                                                            <span>'</span>
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>Scene must show</span>
                                                            {renderBlank(9, "w-32", true, 'line')}
                                                        </div>
                                                    </td>
                                                    <td className="border border-black p-4 align-top">
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>The photograph was too</span>
                                                            {renderBlank(10, "w-32", true, 'line')}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test 8 Part 1 */}
                        {activePart === 1 && test.id === 8 && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 1–10</p>
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-3xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">Job details from employment agency</h3>

                                        <div className="space-y-6 ml-4 text-lg">
                                            {/* Role */}
                                            <div className="grid grid-cols-[150px_1fr] gap-4 items-baseline">
                                                <span className="font-bold">Role</span>
                                                <div className="flex flex-wrap items-baseline gap-2">
                                                    <span className="font-bold">1</span>
                                                    {renderBlank(1, "w-48", false, 'line')}
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-bold">Location</span>
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>Fordham</span>
                                                        <span className="font-bold">2</span>
                                                        {renderBlank(2, "w-48", false, 'line')}
                                                        <span>Centre</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span className="font-bold">3</span>
                                                        {renderBlank(3, "w-48", false, 'line')}
                                                        <span>Road, Fordham</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Work involves */}
                                            <div className="mt-6">
                                                <h4 className="font-bold text-lg mb-2 text-slate-800">Work involves</h4>
                                                <ul className="list-disc pl-5 space-y-3">
                                                    <li>dealing with enquiries</li>
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>making</span>
                                                            <span className="font-bold">4</span>
                                                            {renderBlank(4, "w-48", false, 'line')}
                                                            <span>and reorganising them</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>maintaining the internal</span>
                                                            <span className="font-bold">5</span>
                                                            {renderBlank(5, "w-48", false, 'line')}
                                                        </div>
                                                    </li>
                                                    <li>general administration</li>
                                                </ul>
                                            </div>

                                            {/* Requirements */}
                                            <div className="mt-6">
                                                <h4 className="font-bold text-lg mb-2 text-slate-800">Requirements</h4>
                                                <ul className="list-disc pl-5 space-y-3">
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span className="font-bold">6</span>
                                                            {renderBlank(6, "w-48", false, 'line')}
                                                            <span>(essential)</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>a calm and</span>
                                                            <span className="font-bold">7</span>
                                                            {renderBlank(7, "w-48", false, 'line')}
                                                            <span>manner</span>
                                                        </div>
                                                    </li>
                                                    <li>good IT skills</li>
                                                </ul>
                                            </div>

                                            {/* Other information */}
                                            <div className="mt-6">
                                                <h4 className="font-bold text-lg mb-2 text-slate-800">Other information</h4>
                                                <ul className="list-disc pl-5 space-y-3">
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>a</span>
                                                            <span className="font-bold">8</span>
                                                            {renderBlank(8, "w-48", false, 'line')}
                                                            <span>job – further opportunities may be available</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>hours: 7.45 a.m. to</span>
                                                            <span className="font-bold">9</span>
                                                            {renderBlank(9, "w-24", false, 'line')}
                                                            <span>p.m. Monday to Friday</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span className="font-bold">10</span>
                                                            {renderBlank(10, "w-48", false, 'line')}
                                                            <span>is available onsite</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Test 11 Part 1 */}
                        {test.id === 11 && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-12">
                                    <p className="italic mb-2">Questions 1–10</p>
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto shadow-sm">
                                        <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Employment Agency: Possible Jobs</h3>

                                        <div className="space-y-12">
                                            {/* First Job */}
                                            <div>
                                                <h4 className="text-xl font-bold mb-6 text-slate-900 border-b border-black pb-2 inline-block">First Job</h4>
                                                <div className="space-y-6">
                                                    <div className="flex flex-wrap items-baseline gap-x-2 text-lg">
                                                        <span>Administrative assistant in a company that produces</span>
                                                        {renderBlank(1, "w-64", true, 'line')}
                                                        <span className="text-slate-600">(North London)</span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h5 className="font-bold text-lg mb-3">Responsibilities</h5>
                                                        <ul className="list-disc pl-8 space-y-4 text-lg">
                                                            <li>data entry</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>go to</span>
                                                                    {renderBlank(2, "w-64", true, 'line')}
                                                                    <span>and take notes</span>
                                                                </div>
                                                            </li>
                                                            <li>general admin</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>management of</span>
                                                                    {renderBlank(3, "w-64", true, 'line')}
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h5 className="font-bold text-lg mb-3">Requirements</h5>
                                                        <ul className="list-disc pl-8 space-y-4 text-lg">
                                                            <li>good computer skills including spreadsheets</li>
                                                            <li>good interpersonal skills</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>attention to</span>
                                                                    {renderBlank(4, "w-64", true, 'line')}
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h5 className="font-bold text-lg mb-3">Experience</h5>
                                                        <ul className="list-disc pl-8 space-y-4 text-lg">
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>need a minimum of</span>
                                                                    {renderBlank(5, "w-40", true, 'line')}
                                                                    <span>of experience of teleconferencing</span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Second Job */}
                                            <div>
                                                <h4 className="text-xl font-bold mb-6 text-slate-900 border-b border-black pb-2 inline-block">Second Job</h4>
                                                <div className="space-y-6">
                                                    <div className="text-lg font-medium text-slate-800 mb-4">Warehouse assistant in South London</div>

                                                    <div className="mt-4">
                                                        <h5 className="font-bold text-lg mb-3">Responsibilities</h5>
                                                        <ul className="list-disc pl-8 space-y-4 text-lg">
                                                            <li>stock management</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>managing</span>
                                                                    {renderBlank(6, "w-64", true, 'line')}
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h5 className="font-bold text-lg mb-3">Requirements</h5>
                                                        <ul className="list-disc pl-8 space-y-4 text-lg">
                                                            <li>ability to work with numbers</li>
                                                            <li>good computer skills</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>very organised and</span>
                                                                    {renderBlank(7, "w-64", true, 'line')}
                                                                </div>
                                                            </li>
                                                            <li>good communication skills</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>used to working in a</span>
                                                                    {renderBlank(8, "w-64", true, 'line')}
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    <span>able to cope with items that are</span>
                                                                    {renderBlank(9, "w-64", true, 'line')}
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h5 className="font-bold text-lg mb-3">Need experience of</h5>
                                                        <ul className="list-disc pl-8 space-y-4 text-lg">
                                                            <li>driving in London</li>
                                                            <li>warehouse work</li>
                                                            <li>
                                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                                    {renderBlank(10, "w-64", true, 'line')}
                                                                    <span>service</span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </>
                )
                }

                {/* Part 2 Content */}
                {
                    activePart === 2 && (
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-baseline mb-6">
                                <h2 className="text-xl font-bold mr-4">PART 2</h2>
                                <span className="italic text-lg">Questions 11–20</span>
                            </div>






                            {test.id === 12 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-16: Map Labeling - Test 12 */}
                                    <div className="mb-12">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 11–16</span>
                                        </div>
                                        <p className="italic mb-2">Label the map below.</p>
                                        <p className="italic mb-6">Write the correct letter, <strong>A–H</strong>, next to Questions 11–16.</p>
                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Croft Valley Park</h3>
                                        {renderMapDiagram(
                                            "/ielts/listening/test-12/map.png",
                                            test.questions.filter((q: any) => q.part === 2),
                                            undefined
                                        )}
                                    </div>
                                    {/* Questions 17-20: Pick Two */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 17),
                                            test.questions.find((q: any) => q.id === 18)
                                        )}
                                        <div className="mt-8"></div>
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 19),
                                            test.questions.find((q: any) => q.id === 20)
                                        )}
                                    </div>
                                </div>
                            ) : test.id === 10 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-14 */}
                                    <div className="mb-12">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 11–14</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Minster Park</h3>
                                        <div className="space-y-8">
                                            {[11, 12, 13, 14].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 15-20 */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 15–20</span>
                                        </div>
                                        <p className="italic mb-2">Label the map below.</p>
                                        <p className="italic mb-6">Write the correct letter, <strong>A–I</strong>, next to Questions 15–20.</p>

                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Minster Park</h3>
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            {/* Map Image Placeholder */}
                                            <div className="flex-1 w-full bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-4">
                                                <img
                                                    src="/images/test-10-map.png"
                                                    alt="Minster Park Map"
                                                    className="max-w-full h-auto object-contain"
                                                />
                                            </div>

                                            {/* Questions List */}
                                            <div className="w-full md:w-1/3 shrink-0">
                                                <div className="space-y-6">
                                                    {[15, 16, 17, 18, 19, 20].map(id => {
                                                        const q = test.questions.find((q: any) => q.id === id);
                                                        if (!q) return null;
                                                        return (
                                                            <div key={id} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold w-6">{q.questionNumber}</span>
                                                                    <span className="text-base">{q.question}</span>
                                                                </div>
                                                                <div className="ml-4">
                                                                    {renderBlank(id, "w-16", false)}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : test.id === 7 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-12 (Pick Two) */}
                                    <div className="mb-8">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 11),
                                            test.questions.find((q: any) => q.id === 12)
                                        )}
                                    </div>

                                    {/* Questions 13-14 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 13),
                                            test.questions.find((q: any) => q.id === 14)
                                        )}
                                    </div>

                                    {/* Questions 15-20 (Multiple Choice) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 15–20</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[15, 16, 17, 18, 19, 20].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : test.id === 8 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-14 */}
                                    <div className="mb-12">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 11–14</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[11, 12, 13, 14].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 15-20 */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 15–20</span>
                                        </div>
                                        <p className="italic mb-6">What information does the speaker give about each of the following areas of the museum?</p>
                                        <p className="italic mb-8 font-serif leading-relaxed">Choose <strong>SIX</strong> answers from the box and write the correct letter, <strong>A–H</strong>, next to Questions 15–20.</p>

                                        {renderMatching(
                                            [15, 16, 17, 18, 19, 20].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "Parents must supervise their children." },
                                                { letter: "B", text: "There are new things to see." },
                                                { letter: "C", text: "It is closed today." },
                                                { letter: "D", text: "This is only for school groups." },
                                                { letter: "E", text: "There is a quiz for visitors." },
                                                { letter: "F", text: "It features something created by students." },
                                                { letter: "G", text: "An expert is here today." },
                                                { letter: "H", text: "There is a one-way system." }
                                            ],
                                            "Information",
                                            "",
                                            "Areas of museum"
                                        )}
                                    </div>
                                </div>

                            ) : test.id === 9 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-14 */}
                                    <div className="mb-8">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 11–14</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Matthews Island Holidays</h3>
                                        <div className="space-y-8">
                                            {[11, 12, 13, 14].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 15-20 */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 15–20</span>
                                        </div>
                                        <p className="italic mb-6">Complete the table below.</p>
                                        <p className="italic mb-6">Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p>

                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Timetable for Isle of Man holiday</h3>

                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-slate-300 text-sm md:text-base">
                                                <thead>
                                                    <tr className="bg-slate-100">
                                                        <th className="border border-slate-300 p-3 text-left w-24"></th>
                                                        <th className="border border-slate-300 p-3 text-left w-1/3">Activity</th>
                                                        <th className="border border-slate-300 p-3 text-left">Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Day 1 */}
                                                    <tr>
                                                        <td className="border border-slate-300 p-3 font-bold">Day 1</td>
                                                        <td className="border border-slate-300 p-3">Arrive</td>
                                                        <td className="border border-slate-300 p-3">
                                                            <div className="space-y-2">
                                                                <p>Introduction by manager</p>
                                                                <div className="flex flex-wrap items-baseline gap-1">
                                                                    <span>Hotel dining room has view of the</span>
                                                                    {renderBlank(15, "w-32")}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* Day 2 */}
                                                    <tr>
                                                        <td className="border border-slate-300 p-3 font-bold">Day 2</td>
                                                        <td className="border border-slate-300 p-3">Tynwald Exhibition and Peel</td>
                                                        <td className="border border-slate-300 p-3">
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Tynwald may have been founded in</span>
                                                                {renderBlank(16, "w-32")}
                                                                <span>not 979.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* Day 3 */}
                                                    <tr>
                                                        <td className="border border-slate-300 p-3 font-bold">Day 3</td>
                                                        <td className="border border-slate-300 p-3">Trip to Snaefell</td>
                                                        <td className="border border-slate-300 p-3">
                                                            <div className="space-y-2">
                                                                <p>Travel along promenade in a tram; train to Laxey;</p>
                                                                <div className="flex flex-wrap items-baseline gap-1">
                                                                    <span>train to the</span>
                                                                    {renderBlank(17, "w-32")}
                                                                    <span>of Snaefell</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* Day 4 */}
                                                    <tr>
                                                        <td className="border border-slate-300 p-3 font-bold">Day 4</td>
                                                        <td className="border border-slate-300 p-3">Free day</td>
                                                        <td className="border border-slate-300 p-3">
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Company provides a</span>
                                                                {renderBlank(18, "w-32")}
                                                                <span>for local transport and heritage sites.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* Day 5 */}
                                                    <tr>
                                                        <td className="border border-slate-300 p-3 font-bold">Day 5</td>
                                                        <td className="border border-slate-300 p-3">
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Take the</span>
                                                                {renderBlank(19, "w-32")}
                                                                <span>railway train from Douglas to Port Erin</span>
                                                            </div>
                                                        </td>
                                                        <td className="border border-slate-300 p-3">
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span>Free time, then coach to Castletown – former</span>
                                                                {renderBlank(20, "w-32")}
                                                                <span>has old castle.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* Day 6 */}
                                                    <tr>
                                                        <td className="border border-slate-300 p-3 font-bold">Day 6</td>
                                                        <td className="border border-slate-300 p-3">Leave</td>
                                                        <td className="border border-slate-300 p-3">Leave the island by ferry or plane</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : test.id === 1 ? (
                                <>
                                    {renderMatching(
                                        test.questions.slice(10, 16),
                                        test.questions[10].options.map((opt: string) => ({
                                            letter: opt.charAt(0),
                                            text: opt.substring(1).trim()
                                        })),
                                        "Information",
                                        "What information is given about each of the following festival workshops? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 11–16.",
                                        "Festival workshops"
                                    )}

                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 17),
                                            test.questions.find((q: any) => q.id === 18)
                                        )}
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 19),
                                            test.questions.find((q: any) => q.id === 20)
                                        )}
                                    </div>
                                </>
                            ) : test.id === 2 ? (
                                <>
                                    <div className="mb-4">
                                        <span className="italic text-lg">Questions 11–16</span>
                                    </div>
                                    <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                    <h3 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Working as a lifeboat volunteer</h3>

                                    <div className="space-y-8">
                                        {[11, 12, 13, 14, 15, 16].map(id => {
                                            const q = test.questions.find((q: any) => q.id === id);
                                            if (!q) return null;

                                            return (
                                                <div key={q.id} className="mb-6">
                                                    <div className="flex gap-4 mb-3">
                                                        <span className="font-bold text-lg min-w-[24px]">{q.questionNumber}</span>
                                                        <p className="font-medium text-lg leading-relaxed">{q.question}</p>
                                                    </div>
                                                    <div className="ml-10 space-y-3">
                                                        {q.options.map((option: string) => {
                                                            const letter = option.charAt(0);
                                                            const isSelected = answers[q.id] === letter;

                                                            let optionClass = "flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all hover:bg-slate-50";
                                                            if (!result) {
                                                                if (isSelected) optionClass += " border-purple-500 bg-purple-50 ring-1 ring-purple-500";
                                                                else optionClass += " border-transparent";
                                                            } else {
                                                                const correctLetter = result.correctAnswers[q.id];
                                                                if (letter === correctLetter) optionClass += " border-green-500 bg-green-50 text-green-700 font-medium";
                                                                else if (isSelected && letter !== correctLetter) optionClass += " border-red-500 bg-red-50 text-red-700";
                                                                else optionClass += " border-transparent opacity-60";
                                                            }

                                                            return (
                                                                <div key={option} onClick={() => !result && handleAnswerChange(q.id, letter)} className={optionClass}>
                                                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold shrink-0 transition-colors
                                                                    ${isSelected || (result && letter === result.correctAnswers[q.id]) ? 'border-current' : 'border-slate-400 text-slate-500'}`}>
                                                                        {letter}
                                                                    </span>
                                                                    <span className="text-lg">{option.substring(3).trim()}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 17),
                                            test.questions.find((q: any) => q.id === 18)
                                        )}
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 19),
                                            test.questions.find((q: any) => q.id === 20)
                                        )}
                                    </div>
                                </>
                            ) : test.id === 4 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-14 (Pick Two) */}
                                    <div className="mb-8 space-y-8">
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 11),
                                            test.questions.find((q: any) => q.id === 12)
                                        )}
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 13),
                                            test.questions.find((q: any) => q.id === 14)
                                        )}
                                    </div>

                                    {/* Questions 15-18 (Matching) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [15, 16, 17, 18].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "a lack of confidence" },
                                                { letter: "B", text: "a dislike of running" },
                                                { letter: "C", text: "a lack of time" }
                                            ],
                                            "Reasons",
                                            "What reason prevented each of the following members of the Compton Park Runners Club from joining until recently?\nWrite the correct letter, A, B, or C next to Questions 15–18.",
                                            "Club members"
                                        )}
                                    </div>

                                    {/* Questions 19-20 (Multiple Choice) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 19 and 20</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[19, 20].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : test.id === 5 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-13 (Multiple Choice) */}
                                    <div className="mb-0">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 11–13</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <h3 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Becoming a volunteer for ACE</h3>
                                        <div className="space-y-8">
                                            {[11, 12, 13].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 14-15 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 14 and 15</span>
                                        </div>
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 14),
                                            test.questions.find((q: any) => q.id === 15)
                                        )}
                                    </div>

                                    {/* Questions 16-20 (Matching) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [16, 17, 18, 19, 20].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "experience on stage" },
                                                { letter: "B", text: "original, new ideas" },
                                                { letter: "C", text: "parenting skills" },
                                                { letter: "D", text: "an understanding of food and diet" },
                                                { letter: "E", text: "retail experience" },
                                                { letter: "F", text: "a good memory" },
                                                { letter: "G", text: "a good level of fitness" }
                                            ],
                                            "Helpful things volunteers might offer",
                                            "What does the speaker suggest would be helpful for each of the following areas of voluntary work?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.",
                                            "Area of voluntary work"
                                        )}
                                    </div>
                                </div>
                            ) : test.id === 6 ? (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 11-12 (Pick Two) */}
                                    <div className="mb-8">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 11),
                                            test.questions.find((q: any) => q.id === 12)
                                        )}
                                    </div>

                                    {/* Questions 13-14 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 13),
                                            test.questions.find((q: any) => q.id === 14)
                                        )}
                                    </div>

                                    {/* Questions 15-20 (Map) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMapDiagram(
                                            "/images/test-6-map.png",
                                            [15, 16, 17, 18, 19, 20].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean)
                                        )}
                                    </div>
                                </div>
                            ) : test.id === 11 ? (
                                <div className="animate-in fade-in duration-300">
                                    <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">Street Play Scheme</h3>

                                    {/* Questions 11-16 */}
                                    <div className="mb-12">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 11–16</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[11, 12, 13, 14, 15, 16].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 17 and 18 */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 17),
                                            test.questions.find((q: any) => q.id === 18)
                                        )}
                                    </div>

                                    {/* Questions 19 and 20 */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 19),
                                            test.questions.find((q: any) => q.id === 20)
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-black p-6">
                                    <div className="mb-4">
                                        <span className="italic text-lg">Questions 11–14</span>
                                    </div>

                                    <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>

                                    <h3 className="text-xl font-bold text-center mb-8">Stanthorpe Twinning Association</h3>

                                    <div className="space-y-8">
                                        {[11, 12, 13, 14, 15].map(id => {
                                            const q = test.questions.find((q: any) => q.id === id);
                                            if (!q) return null;

                                            const isAnswered = answers[q.id];

                                            return (
                                                <div key={q.id} className="mb-6">
                                                    <div className="flex gap-4 mb-3">
                                                        <span className="font-bold text-lg min-w-[24px]">{q.questionNumber}</span>
                                                        <p className="font-medium text-lg leading-relaxed">{q.question}</p>
                                                    </div>
                                                    <div className="ml-10 space-y-3">
                                                        {q.options?.map((option: string) => {
                                                            const letter = option.charAt(0); // "A", "B", "C"
                                                            const isSelected = answers[q.id] === letter;

                                                            let optionClass = "flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all hover:bg-slate-50";
                                                            if (!result) {
                                                                if (isSelected) optionClass += " border-purple-500 bg-purple-50 ring-1 ring-purple-500";
                                                                else optionClass += " border-transparent";
                                                            } else {
                                                                // Result mode logic
                                                                const correctLetter = result.correctAnswers[q.id];
                                                                if (letter === correctLetter) {
                                                                    optionClass += " border-green-500 bg-green-50 text-green-700 font-medium";
                                                                } else if (isSelected && letter !== correctLetter) {
                                                                    optionClass += " border-red-500 bg-red-50 text-red-700";
                                                                } else {
                                                                    optionClass += " border-transparent opacity-60";
                                                                }
                                                            }

                                                            return (
                                                                <div
                                                                    key={option}
                                                                    onClick={() => !result && handleAnswerChange(q.id, letter)}
                                                                    className={optionClass}
                                                                >
                                                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold shrink-0 transition-colors
                                                                    ${isSelected || (result && letter === result.correctAnswers[q.id])
                                                                            ? 'border-current'
                                                                            : 'border-slate-400 text-slate-500'
                                                                        }`}
                                                                    >
                                                                        {letter}
                                                                    </span>
                                                                    <span className="text-lg">{option.substring(3).trim()}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Map Section */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 15–20</span>
                                        </div>

                                        <p className="italic mb-2">Label the map below.</p>
                                        <p className="italic mb-6">Write the correct letter, <strong>A–H</strong>, next to Questions 15–20.</p>

                                        <h3 className="text-xl font-bold text-center mb-6">Plan of Stevenson&apos;s site</h3>

                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            {/* Map Image */}
                                            <div className="flex-1 w-full relative">
                                                <img
                                                    src="/images/test-13-map.png"
                                                    alt="Plan of Stevenson's site"
                                                    className="w-full h-auto border border-slate-300 rounded shadow-sm"
                                                />
                                            </div>

                                            {/* Questions List */}
                                            <div className="w-full md:w-1/3 shrink-0">
                                                <div className="space-y-6">
                                                    {[15, 16, 17, 18, 19, 20].map(id => {
                                                        const q = test.questions.find((q: any) => q.id === id);
                                                        if (!q) return null;

                                                        return (
                                                            <div key={id} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold w-6">{q.questionNumber}</span>
                                                                    <span className="text-base">{q.question}</span>
                                                                </div>
                                                                <div className="ml-4">
                                                                    {renderBlank(id, "w-16", false)}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }


                {/* Part 3 Content */}
                {
                    activePart === 3 && (
                        <div className="bg-white p-6 animate-in fade-in duration-300">
                            <div className="flex items-baseline mb-6">
                                <h2 className="text-xl font-bold mr-4">PART 3</h2>
                                <span className="italic text-lg">Questions 21–30</span>
                            </div>



                            {test.id === 13 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-24: Pick Two */}
                                    <div className="mb-12">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 21–24</span>
                                        </div>
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>

                                        <div className="space-y-8 max-w-4xl ml-4">
                                            {renderPickTwo(
                                                test.questions.find((q: any) => q.id === 21),
                                                test.questions.find((q: any) => q.id === 22)
                                            )}

                                            {renderPickTwo(
                                                test.questions.find((q: any) => q.id === 23),
                                                test.questions.find((q: any) => q.id === 24)
                                            )}
                                        </div>
                                    </div>

                                    {/* Questions 25-30: Matching */}
                                    <div className="pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 25–30</span>
                                        </div>
                                        <p className="italic mb-4">Which personal meaning do the students decide to give to each of the following pictures?</p>
                                        <p className="italic mb-6">Choose <strong>SIX</strong> answers from the box and write the correct letter, <strong>A–H</strong>, next to Questions 25–30.</p>

                                        {/* Options Box */}
                                        <div className="border border-black p-6 mb-8 bg-white max-w-4xl ml-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { letter: "A", text: "a childhood memory" },
                                                    { letter: "B", text: "hope for the future" },
                                                    { letter: "C", text: "fast movement" },
                                                    { letter: "D", "text": "a potential threat" },
                                                    { letter: "E", "text": "the power of colour" },
                                                    { letter: "F", "text": "the continuity of life" },
                                                    { letter: "G", "text": "protection of nature" },
                                                    { letter: "H", "text": "a confused attitude to nature" }
                                                ].map(opt => (
                                                    <div key={opt.letter} className="flex gap-2">
                                                        <span className="font-bold">{opt.letter}</span>
                                                        <span>{opt.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Questions */}
                                        <div className="max-w-4xl ml-4 space-y-4">
                                            <h3 className="font-bold text-lg mb-4 underline">Pictures</h3>
                                            {test.questions.filter((q: any) => q.questionNumber >= 25 && q.questionNumber <= 30).map((q: any) => (
                                                <div key={q.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold w-6">{q.questionNumber}</span>
                                                        <span>{q.question}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        {renderBlank(q.id, "w-16", false)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {test.id === 12 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-24: Multiple Choice */}
                                    <div className="mb-12">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 21–24</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Presentation about refrigeration</h3>
                                        <div className="space-y-8">
                                            {[21, 22, 23, 24].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 25-30: Matching */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 25–30</span>
                                        </div>
                                        <p className="italic mb-6">Who is going to do research into each topic?</p>
                                        <p className="italic mb-6">Write the correct letter, <strong>A, B or C</strong>, next to Questions 25–30.</p>

                                        {renderMatching(
                                            [25, 26, 27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "Annie" },
                                                { letter: "B", text: "Jack" },
                                                { letter: "C", text: "both Annie and Jack" }
                                            ],
                                            "Topics",
                                            ""
                                        )}
                                    </div>
                                </div>
                            )}

                            {test.id === 10 && activePart === 3 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21 and 22 (Pick Two) */}
                                    <div className="mb-12">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 21),
                                            test.questions.find((q: any) => q.id === 22)
                                        )}
                                    </div>

                                    {/* Questions 23 and 24 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200 mb-12">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 23),
                                            test.questions.find((q: any) => q.id === 24)
                                        )}
                                    </div>

                                    {/* Questions 25-30 (Matching) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [25, 26, 27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "poverty" },
                                                { letter: "B", text: "education" },
                                                { letter: "C", text: "Dickens's travels" },
                                                { letter: "D", text: "entertainment" },
                                                { letter: "E", text: "crime and the law" },
                                                { letter: "F", text: "wealth" },
                                                { letter: "G", text: "medicine" },
                                                { letter: "H", text: "a woman's life" }
                                            ],
                                            "Topics",
                                            "What topic do Cathy and Graham choose to illustrate with each novel?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.",
                                            "Novels by Dickens"
                                        )}
                                    </div>
                                </div>
                            )}

                            {test.id === 9 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-26 (Matching) */}
                                    <div className="mb-12">
                                        <h3 className="text-xl font-bold text-center mb-6 text-slate-800">Position in family</h3>
                                        {renderMatching(
                                            [21, 22, 23, 24, 25, 26].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "outgoing" },
                                                { letter: "B", text: "selfish" },
                                                { letter: "C", text: "independent" },
                                                { letter: "D", text: "attention-seeking" },
                                                { letter: "E", text: "introverted" },
                                                { letter: "F", text: "co-operative" },
                                                { letter: "G", text: "caring" },
                                                { letter: "H", text: "competitive" }
                                            ],
                                            "Personality Traits",
                                            "What did findings of previous research claim about the personality traits a child is likely to have because of their position in the family?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 21–26.",
                                            "Position in family"
                                        )}
                                    </div>

                                    {/* Questions 27-28 (Multiple Choice) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 27 and 28</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[27, 28].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 29-30 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 29),
                                            test.questions.find((q: any) => q.id === 30)
                                        )}
                                    </div>
                                </div>
                            )}

                            {test.id === 11 && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="mb-12">
                                        <p className="italic mb-2 text-lg">Questions 21–26</p>
                                        <p className="italic mb-2">Complete the notes below.</p>
                                        <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                        <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                            <h3 className="text-xl font-bold mb-6">What Hazel should analyse about items in newspapers:</h3>
                                            <ul className="list-disc pl-5 space-y-6">
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>what</span>
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">21</span>
                                                            {renderBlank(21, "w-48", false)}
                                                        </div>
                                                        <span>the item is on</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>the</span>
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">22</span>
                                                            {renderBlank(22, "w-48", false)}
                                                        </div>
                                                        <span>of the item, including the headline</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>any</span>
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">23</span>
                                                            {renderBlank(23, "w-48", false)}
                                                        </div>
                                                        <span>accompanying the item</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>the</span>
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">24</span>
                                                            {renderBlank(24, "w-48", false)}
                                                        </div>
                                                        <span>of the item, e.g. what's made prominent</span>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>the writer's main</span>
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">25</span>
                                                            {renderBlank(25, "w-48", false)}
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="pl-2">
                                                    <div className="flex flex-wrap items-baseline gap-2">
                                                        <span>the</span>
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">26</span>
                                                            {renderBlank(26, "w-48", false)}
                                                        </div>
                                                        <span>the writer may make about the reader</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-2 text-lg">Questions 27–30</p>
                                        {renderMatching(
                                            [27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "She will definitely look for a suitable article." },
                                                { letter: "B", text: "She may look for a suitable article." },
                                                { letter: "C", text: "She definitely won't look for an article." }
                                            ],
                                            "Types of articles",
                                            "What does Hazel decide to do about each of the following types of articles?\nChoose the correct letter, A, B or C, next to Questions 27–30."
                                        )}
                                    </div>
                                </div>
                            )}

                            {test.id === 8 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-22 */}
                                    <div className="mb-12">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>

                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 21),
                                            test.questions.find((q: any) => q.id === 22)
                                        )}
                                    </div>

                                    {/* Questions 23-27 Matching */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">


                                        {renderMatching(
                                            [23, 24, 25, 26, 27].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "demonstrated independence" },
                                                { letter: "B", text: "asked for teacher support" },
                                                { letter: "C", text: "developed a competitive attitude" },
                                                { letter: "D", text: "seemed to find the activity calming" },
                                                { letter: "E", text: "seemed pleased with the results" },
                                                { letter: "F", text: "seemed confused" },
                                                { letter: "G", text: "seemed to find the activity easy" }
                                            ],
                                            "Comments",
                                            "Which comment do the students make about each of the following children in the video?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 23–27.",
                                            "Children"
                                        )}
                                    </div>

                                    {/* Questions 28-30 Multiple Choice */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 28–30</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[28, 29, 30].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 7 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-22 (Pick Two) */}
                                    <div className="mb-8">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 21 and 22</span>
                                        </div>
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 21),
                                            test.questions.find((q: any) => q.id === 22)
                                        )}
                                    </div>

                                    {/* Questions 23-24 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 23 and 24</span>
                                        </div>
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 23),
                                            test.questions.find((q: any) => q.id === 24)
                                        )}
                                    </div>

                                    {/* Questions 25-30 (Matching) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [25, 26, 27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "These jobs are likely to be at risk." },
                                                { letter: "B", text: "Their role has become more interesting in recent years." },
                                                { letter: "C", text: "The number of people working in this sector has fallen dramatically." },
                                                { letter: "D", text: "This job will require more qualifications." },
                                                { letter: "E", text: "Higher disposable income has led to a huge increase in jobs." },
                                                { letter: "F", text: "There is likely to be a significant rise in demand for this service." },
                                                { letter: "G", text: "Both employment and productivity have risen." }
                                            ],
                                            "Comments",
                                            "What comment do the students make about each of the following jobs?\nChoose SIX answers from the box and write the correct letter, A–G, next to Questions 25–30.",
                                            "Jobs"
                                        )}
                                    </div>
                                </div>
                            )}
                            {test.id === 5 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-26 (Multiple Choice) */}
                                    <div className="mb-8">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 21–26</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <h3 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Talk on jobs in fashion design</h3>
                                        <div className="space-y-8">
                                            {[21, 22, 23, 24, 25, 26].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 27-28 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 27),
                                            test.questions.find((q: any) => q.id === 28)
                                        )}
                                    </div>

                                    {/* Questions 29-30 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 29),
                                            test.questions.find((q: any) => q.id === 30)
                                        )}
                                    </div>
                                </div>
                            )}
                            {test.id === 1 && (
                                <>
                                    <div className="mb-4">
                                        <span className="italic text-lg">Questions 21–25</span>
                                    </div>
                                    <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                    <h3 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Science experiment for Year 12 students</h3>

                                    <div className="space-y-8">
                                        {[21, 22, 23, 24, 25].map(id => {
                                            const q = test.questions.find((q: any) => q.id === id);
                                            return q ? renderMultipleChoice(q) : null;
                                        })}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 26–30</span>
                                        </div>
                                        <p className="italic mb-2">Complete the flowchart below.</p>
                                        <p className="italic mb-6">Choose FIVE answers from the box and write the correct letter, <strong>A–H</strong>, next to Questions 26–30.</p>

                                        {/* Options Box */}
                                        <div className="border border-black p-6 mb-10 w-fit mx-auto bg-white min-w-[200px]">
                                            <div className="flex flex-col gap-1">
                                                {test.questions.find((q: any) => q.id === 26)?.options.map((opt: string) => {
                                                    const letter = opt.charAt(0);
                                                    const text = opt.replace(/^[A-Z]\s/, '').trim();
                                                    return (
                                                        <div key={letter} className="flex gap-4">
                                                            <span className="font-bold w-4">{letter}</span>
                                                            <span>{text}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Flowchart */}
                                        <div className="max-w-3xl mx-auto space-y-2">
                                            {/* Step 1 */}
                                            <div className="border border-black p-4 text-center bg-white shadow-sm">
                                                <div className="flex flex-wrap items-baseline justify-center gap-2">
                                                    <span>Choose mice which are all the same</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm bg-black text-white px-1.5 py-0.5 rounded-sm">26</span>
                                                        {renderBlank(26, "w-16", false)}
                                                    </div>
                                                    <span>.</span>
                                                </div>
                                            </div>

                                            <div className="text-center text-2xl text-slate-400">↓</div>

                                            {/* Step 2 */}
                                            <div className="border border-black p-4 text-center bg-white shadow-sm">
                                                <div className="flex flex-wrap items-baseline justify-center gap-2">
                                                    <span>Divide the mice into two groups, each with a different</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm bg-black text-white px-1.5 py-0.5 rounded-sm">27</span>
                                                        {renderBlank(27, "w-16", false)}
                                                    </div>
                                                    <span>.</span>
                                                </div>
                                            </div>

                                            <div className="text-center text-2xl text-slate-400">↓</div>

                                            {/* Step 3 */}
                                            <div className="border border-black p-4 bg-white shadow-sm">
                                                <p className="text-center mb-2">Put each group in a separate cage.</p>
                                                <p className="text-center mb-2">Feed group A commercial mouse food.</p>
                                                <div className="flex flex-wrap items-baseline justify-center gap-2">
                                                    <span>Feed group B the same, but also sugar contained in</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm bg-black text-white px-1.5 py-0.5 rounded-sm">28</span>
                                                        {renderBlank(28, "w-16", false)}
                                                    </div>
                                                    <span>.</span>
                                                </div>
                                            </div>

                                            <div className="text-center text-2xl text-slate-400">↓</div>

                                            {/* Step 4 */}
                                            <div className="border border-black p-4 bg-white shadow-sm">
                                                <p className="text-center mb-2">Take measurements using an electronic scale.</p>
                                                <div className="flex flex-wrap items-baseline justify-center gap-2">
                                                    <span>Place them in a weighing chamber to prevent</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm bg-black text-white px-1.5 py-0.5 rounded-sm">29</span>
                                                        {renderBlank(29, "w-16", false)}
                                                    </div>
                                                    <span>.</span>
                                                </div>
                                            </div>

                                            <div className="text-center text-2xl text-slate-400">↓</div>

                                            {/* Step 5 */}
                                            <div className="border border-black p-4 text-center bg-white shadow-sm">
                                                <div className="flex flex-wrap items-baseline justify-center gap-2">
                                                    <span>Do all necessary</span>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm bg-black text-white px-1.5 py-0.5 rounded-sm">30</span>
                                                        {renderBlank(30, "w-16", false)}
                                                    </div>
                                                    <span>.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {test.id === 2 && (
                                <>
                                    <div className="mb-4">
                                        <span className="italic text-lg">Questions 21–24</span>
                                    </div>
                                    <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                    <h3 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Recycling footwear</h3>

                                    <div className="space-y-8">
                                        {[21, 22, 23, 24].map(id => {
                                            const q = test.questions.find((q: any) => q.id === id);
                                            return q ? renderMultipleChoice(q) : null;
                                        })}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [25, 26, 27, 28].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "one shoe was missing" },
                                                { letter: "B", text: "the colour of one shoe had faded" },
                                                { letter: "C", text: "one shoe had a hole in it" },
                                                { letter: "D", text: "the shoes were brand new" },
                                                { letter: "E", text: "the shoes were too dirty" },
                                                { letter: "F", text: "the stitching on the shoes was broken" }
                                            ],
                                            "Reasons",
                                            "What reason did the recycling manager give for rejecting each of the following items of footwear?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 25–28."
                                        )}

                                        <div className="mt-8 pt-8 border-t border-slate-200">
                                            <div className="mb-4">
                                                <span className="italic text-lg">Questions 29 and 30</span>
                                            </div>
                                            <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                            <div className="space-y-8">
                                                {[29, 30].map(id => {
                                                    const q = test.questions.find((q: any) => q.id === id);
                                                    return q ? renderMultipleChoice(q) : null;
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}
                            {test.id === 4 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-25 (Multiple Choice) */}
                                    <div className="mb-8">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 21–25</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[21, 22, 23, 24, 25].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 26-30 (Matching) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [26, 27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "near the entrance" },
                                                { letter: "B", text: "in the attic" },
                                                { letter: "C", text: "at the back of the shop" },
                                                { letter: "D", text: "on a high shelf" },
                                                { letter: "E", text: "near the stairs" },
                                                { letter: "F", text: "in a specially designed space" },
                                                { letter: "G", text: "within the café" }
                                            ],
                                            "Location of books",
                                            "Where does Jane's grandfather keep each of the following types of books in his shop?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 26–30.",
                                            "Types of books"
                                        )}
                                    </div>
                                </div>
                            )}
                            {test.id === 6 && (
                                <div className="animate-in fade-in duration-300">
                                    {/* Questions 21-24 (Multiple Choice) */}
                                    <div className="mb-8">
                                        <div className="mb-4">
                                            <span className="italic text-lg">Questions 21–24</span>
                                        </div>
                                        <p className="italic mb-6">Choose the correct letter, <strong>A, B or C</strong>.</p>
                                        <div className="space-y-8">
                                            {[21, 22, 23, 24].map(id => {
                                                const q = test.questions.find((q: any) => q.id === id);
                                                return q ? renderMultipleChoice(q) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Questions 25-26 (Pick Two) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <p className="italic mb-6">Choose <strong>TWO</strong> letters, <strong>A–E</strong>.</p>
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 25),
                                            test.questions.find((q: any) => q.id === 26)
                                        )}
                                    </div>

                                    {/* Questions 27-30 (Matching) */}
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        {renderMatching(
                                            [27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "This country suffered the most severe loss of life." },
                                                { letter: "B", text: "The impact on agriculture was predictable." },
                                                { letter: "C", text: "There was a significant increase in deaths of young people." },
                                                { letter: "D", text: "Animals suffered from a sickness." },
                                                { letter: "E", text: "This country saw the highest rise in food prices in the world." },
                                                { letter: "F", text: "It caused a particularly harsh winter." }
                                            ],
                                            "Comments",
                                            "What comment do the students make about the impact of the Laki eruption on the following countries?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.",
                                            "Countries"
                                        )}
                                    </div>
                                </div>
                            )}
                            {test.id === 3 && (
                                <>
                                    {/* Fallback for other tests (Test 3) */}
                                    <div className="mb-8">
                                        <span className="italic text-lg">Questions 21–24</span>
                                    </div>
                                    <p className="italic mb-6">Choose the correct letter, <strong>A, B, C, D or E</strong>.</p>
                                    <div className="space-y-8">
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 21),
                                            test.questions.find((q: any) => q.id === 22)
                                        )}
                                        {renderPickTwo(
                                            test.questions.find((q: any) => q.id === 23),
                                            test.questions.find((q: any) => q.id === 24)
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        {renderMatching(
                                            [25, 26, 27, 28, 29, 30].map(id => test.questions.find((q: any) => q.id === id)).filter(Boolean),
                                            [
                                                { letter: "A", text: "This is only relevant to young people." },
                                                { letter: "B", text: "This may have disappointing results." },
                                                { letter: "C", text: "This already seems to be widespread." },
                                                { letter: "D", text: "Retailers should do more to encourage this." },
                                                { letter: "E", text: "More financial support is needed for this." },
                                                { letter: "F", text: "Most people know little about this." },
                                                { letter: "G", text: "There should be stricter regulations about this." },
                                                { letter: "H", text: "This could be dangerous." }
                                            ],
                                            "Opinions",
                                            "What is the students' opinion about each of the following food trends?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30."
                                        )}
                                    </div>
                                </>
                            )}



                        </div>
                    )
                }




                {/* Part 4 Content */}
                {
                    activePart === 4 && (
                        <div className="bg-white p-6 animate-in fade-in duration-300">
                            <div className="flex items-baseline mb-6">
                                <h2 className="text-xl font-bold mr-4">PART 4</h2>
                                <span className="italic text-lg">Questions 31–40</span>
                            </div>

                            {test.id === 13 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-6">Stoicism</h3>

                                        <div className="mb-6 flex flex-wrap items-baseline gap-2 text-lg">
                                            <span>Stoicism is still relevant today because of its</span>
                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">31</span>
                                                {renderBlank(31, "w-48", false)}
                                            </div>
                                            <span>appeal.</span>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Ancient Stoics */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4">Ancient Stoics</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Stoicism was founded over 2,000 years ago in Greece.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>The Stoics' ideas are surprisingly well known, despite not being intended for</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">32</span>
                                                                {renderBlank(32, "w-48", false)}
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Stoic principles */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4">Stoic principles</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Happiness could be achieved by leading a virtuous life.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Controlling emotions was essential.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>Epictetus said that external events cannot be controlled but the</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">33</span>
                                                                {renderBlank(33, "w-48", false)}
                                                            </div>
                                                            <span>people make in response can be controlled.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>A Stoic is someone who has a different view on experiences which others would consider as</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">34</span>
                                                                {renderBlank(34, "w-48", false)}
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* The influence of Stoicism */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4">The influence of Stoicism</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>George Washington organised a</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">35</span>
                                                                {renderBlank(35, "w-48", false)}
                                                            </div>
                                                            <span>about Cato to motivate his men.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>The French artist Delacroix was a Stoic.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>Adam Smith's ideas on</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">36</span>
                                                                {renderBlank(36, "w-48", false)}
                                                            </div>
                                                            <span>were influenced by Stoicism.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Some of today's political leaders are inspired by the Stoics.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Cognitive Behaviour Therapy (CBT)</span>
                                                        <ul className="list-[circle] ml-6 mt-2 space-y-2">
                                                            <li className="text-lg pl-2 leading-loose">
                                                                <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                    <span>the treatment for</span>
                                                                    <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                        <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">37</span>
                                                                        {renderBlank(37, "w-48", false)}
                                                                    </div>
                                                                    <span>is based on ideas from Stoicism</span>
                                                                </div>
                                                            </li>
                                                            <li className="text-lg pl-2 leading-loose">
                                                                <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                    <span>people learn to base their thinking on</span>
                                                                    <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                        <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">38</span>
                                                                        {renderBlank(38, "w-48", false)}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>In business, people benefit from Stoicism by identifying obstacles as</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">39</span>
                                                                {renderBlank(39, "w-48", false)}
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Relevance of Stoicism */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4">Relevance of Stoicism</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>It requires a lot of</span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">40</span>
                                                                {renderBlank(40, "w-48", false)}
                                                            </div>
                                                            <span>but Stoicism can help people to lead a good life.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>It teaches people that having a strong character is more important than anything else.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {test.id === 10 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">Agricultural programme in Mozambique</h3>

                                        <div className="space-y-8">
                                            {/* Section - How the programme was organised */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 underline">How the programme was organised</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>It focused on a dry and arid region in Chicualacuala district, near the Limpopo River.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>People depended on the forest to provide charcoal as a source of income.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">31</span>
                                                            {renderBlank(31, "w-48", false)}
                                                        </div>
                                                        <span>was seen as the main priority to ensure the supply of water.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Most of the work organised by farmers' associations was done by </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">32</span>
                                                            {renderBlank(32, "w-48", false)}
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Fenced areas were created to keep animals away from crops.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section - The programme provided */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 underline">The programme provided</h4>
                                                <ul className="list-none ml-6 space-y-3">
                                                    <li className="flex flex-wrap items-baseline gap-2 text-lg">
                                                        <span>– </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">33</span>
                                                            {renderBlank(33, "w-40", false)}
                                                        </div>
                                                        <span>for the fences</span>
                                                    </li>
                                                    <li className="flex flex-wrap items-baseline gap-2 text-lg">
                                                        <span>– </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">34</span>
                                                            {renderBlank(34, "w-40", false)}
                                                        </div>
                                                        <span>for suitable crops</span>
                                                    </li>
                                                    <li className="flex flex-wrap items-baseline gap-2 text-lg">
                                                        <span>– water pumps.</span>
                                                    </li>
                                                </ul>
                                            </div>


                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 underline">The farmers provided</h4>
                                                <ul className="list-none ml-6 space-y-3">
                                                    <li className="flex flex-wrap items-baseline gap-2 text-lg">
                                                        <span>– labour</span>
                                                    </li>
                                                    <li className="flex flex-wrap items-baseline gap-2 text-lg">
                                                        <span>– </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">35</span>
                                                            {renderBlank(35, "w-40", false)}
                                                        </div>
                                                        <span>for the fences on their land.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section - Further developments */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 underline">Further developments</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>The marketing of produce was sometimes difficult due to lack of </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">36</span>
                                                            {renderBlank(36, "w-48", false)}
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Training was therefore provided in methods of food </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">37</span>
                                                            {renderBlank(37, "w-48", false)}
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Farmers made special places where </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">38</span>
                                                            {renderBlank(38, "w-48", false)}
                                                        </div>
                                                        <span>could be kept.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Local people later suggested keeping </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">39</span>
                                                            {renderBlank(39, "w-48", false)}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section - Evaluation and lessons learned */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 underline">Evaluation and lessons learned</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Agricultural production increased, improving incomes and food security.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Enough time must be allowed, particularly for the </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">40</span>
                                                            {renderBlank(40, "w-48", false)}
                                                        </div>
                                                        <span>phase of the programme.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {test.id === 9 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">The Eucalyptus Tree in Australia</h3>

                                        <div className="space-y-8">
                                            {/* Importance */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">Importance</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>it provides </span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">31</span>
                                                                {renderBlank(31, "w-48", false)}
                                                            </div>
                                                            <span> and food for a wide range of species</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <div className="inline-flex flex-wrap items-baseline gap-2">
                                                            <span>its leaves provide </span>
                                                            <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">32</span>
                                                                {renderBlank(32, "w-48", false)}
                                                            </div>
                                                            <span> which is used to make a disinfectant</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Reasons for present decline */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">Reasons for present decline in number</h4>

                                                {/* A) Diseases */}
                                                <div className="mb-4">
                                                    <h5 className="font-bold text-md mb-2 ml-4">A) Diseases</h5>
                                                    <div className="ml-8">
                                                        <p className="mb-2 italic">(i) 'Mundulla Yellows'</p>
                                                        <ul className="list-disc ml-6 space-y-2 mb-4">
                                                            <li className="text-lg pl-2 leading-loose">
                                                                <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                    <span>Cause – lime used for making </span>
                                                                    <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                        <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">33</span>
                                                                        {renderBlank(33, "w-48", false)}
                                                                    </div>
                                                                    <span> was absorbed</span>
                                                                </div>
                                                            </li>
                                                            <li className="text-lg pl-2">
                                                                <span>trees were unable to take in necessary iron through their roots</span>
                                                            </li>
                                                        </ul>

                                                        <p className="mb-2 italic">(ii) 'Bell-miner Associated Die-back'</p>
                                                        <ul className="list-disc ml-6 space-y-2">
                                                            <li className="text-lg pl-2 leading-loose">
                                                                <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                    <span>Cause – </span>
                                                                    <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                        <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">34</span>
                                                                        {renderBlank(34, "w-48", false)}
                                                                    </div>
                                                                    <span> feed on eucalyptus leaves</span>
                                                                </div>
                                                            </li>
                                                            <li className="text-lg pl-2">
                                                                <span>they secrete a substance containing sugar</span>
                                                            </li>
                                                            <li className="text-lg pl-2">
                                                                <span>bell-miner birds are attracted by this and keep away other species</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* B) Bushfires */}
                                                <div>
                                                    <h5 className="font-bold text-md mb-2 ml-4">B) Bushfires</h5>
                                                    <p className="ml-8 mb-2">William Jackson's theory:</p>
                                                    <ul className="list-disc ml-12 space-y-3">
                                                        <li className="text-lg pl-2 leading-loose">
                                                            <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                <span>high-frequency bushfires have impact on vegetation, resulting in the growth of </span>
                                                                <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                    <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">35</span>
                                                                    {renderBlank(35, "w-48", false)}
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="text-lg pl-2">
                                                            <span>mid-frequency bushfires result in the growth of eucalyptus forests, because they:</span>
                                                            <ul className="list-[circle] ml-6 mt-2 space-y-2">
                                                                <li className="text-lg pl-2 leading-loose">
                                                                    <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                        <span>make more </span>
                                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">36</span>
                                                                            {renderBlank(36, "w-48", false)}
                                                                        </div>
                                                                        <span> available to the trees</span>
                                                                    </div>
                                                                </li>
                                                                <li className="text-lg pl-2 leading-loose">
                                                                    <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                        <span>maintain the quality of the </span>
                                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">37</span>
                                                                            {renderBlank(37, "w-48", false)}
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="text-lg pl-2">
                                                            <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                <span>low-frequency bushfires result in the growth of </span>
                                                                <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                    <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">38</span>
                                                                    {renderBlank(38, "w-48", false)}
                                                                </div>
                                                                <span> 'rainforest', which is:</span>
                                                            </div>
                                                            <ul className="list-[circle] ml-6 mt-2 space-y-2">
                                                                <li className="text-lg pl-2 leading-loose">
                                                                    <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                        <span>a </span>
                                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">39</span>
                                                                            {renderBlank(39, "w-48", false)}
                                                                        </div>
                                                                        <span> ecosystem</span>
                                                                    </div>
                                                                </li>
                                                                <li className="text-lg pl-2 leading-loose">
                                                                    <div className="inline-flex flex-wrap items-baseline gap-2">
                                                                        <span>an ideal environment for the </span>
                                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">40</span>
                                                                            {renderBlank(40, "w-48", false)}
                                                                        </div>
                                                                        <span> of the bell-miner</span>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 8 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">Victor Hugo</h3>

                                        <div className="space-y-8">
                                            {/* Section 1 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">His novel, <i>Les Misérables</i></h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2">
                                                        <span>It has been adapted for theatre and cinema.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>We know more about its overall </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">31</span>
                                                            {renderBlank(31, "w-48", false)}
                                                        </div>
                                                        <span> than about its author.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">His early career</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2">
                                                        <span>In Paris, his career was successful and he led the Romantic movement.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>He spoke publicly about social issues, such as </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">32</span>
                                                            {renderBlank(32, "w-48", false)}
                                                        </div>
                                                        <span> and education.</span>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <span>Napoleon III disliked his views and exiled him.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">His exile from France</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Victor Hugo had to live elsewhere in </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">33</span>
                                                            {renderBlank(33, "w-48", false)}
                                                        </div>
                                                        <span> .</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>He used his income from the sale of some </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">34</span>
                                                            {renderBlank(34, "w-48", false)}
                                                        </div>
                                                        <span> he had written to buy a house on Guernsey.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 4 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">His house on Guernsey</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2">
                                                        <span>Victor Hugo lived in this house until the end of the Empire in France.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>The ground floor contains portraits, </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">35</span>
                                                            {renderBlank(35, "w-48", false)}
                                                        </div>
                                                        <span> and tapestries that he valued.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>He bought cheap </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">36</span>
                                                            {renderBlank(36, "w-48", false)}
                                                        </div>
                                                        <span> made of wood and turned this into beautiful wall carvings.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>The first floor consists of furnished areas with wallpaper and </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">37</span>
                                                            {renderBlank(37, "w-48", false)}
                                                        </div>
                                                        <span> that have a Chinese design.</span>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <span>The library still contains many of his favourite books.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>He wrote in a room at the top of the house that had a view of the </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">38</span>
                                                            {renderBlank(38, "w-48", false)}
                                                        </div>
                                                        <span> .</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>He entertained other writers as well as poor </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">39</span>
                                                            {renderBlank(39, "w-48", false)}
                                                        </div>
                                                        <span> in his house.</span>
                                                    </li>
                                                    <li className="text-lg pl-2 leading-loose">
                                                        <span>Victor Hugo's </span>
                                                        <div className="inline-flex items-center gap-2 align-baseline mx-1">
                                                            <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">40</span>
                                                            {renderBlank(40, "w-48", false)}
                                                        </div>
                                                        <span> gave ownership of the house to the city of Paris in 1927.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 7 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8 bg-white max-w-4xl mx-auto">
                                        <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">Space Traffic Management</h3>

                                        <div className="space-y-8">
                                            {/* Section 1 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">A Space Traffic Management system</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2">
                                                        <span>is a concept similar to Air Traffic Control, but for satellites rather than planes.</span>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>would aim to set up legal and</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">31</span>
                                                                {renderBlank(31, "w-48", false)}
                                                            </div>
                                                            <span>ways of improving safety.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <span>does not actually exist at present.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">Problems in developing effective Space Traffic Management</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>Satellites are now quite</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">32</span>
                                                                {renderBlank(32, "w-40", false)}
                                                            </div>
                                                            <span>and therefore more widespread</span>
                                                        </div>
                                                        <div className="flex flex-wrap items-baseline gap-2 mt-2 ml-4">
                                                            <span>(e.g. there are constellations made up of</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">33</span>
                                                                {renderBlank(33, "w-40", false)}
                                                            </div>
                                                            <span>of satellites).</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>At present, satellites are not required to transmit information to help with their</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">34</span>
                                                                {renderBlank(34, "w-48", false)}
                                                            </div>
                                                            <span>.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>There are few systems for</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">35</span>
                                                                {renderBlank(35, "w-48", false)}
                                                            </div>
                                                            <span>satellites.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <span>Small pieces of debris may be difficult to identify.</span>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>Operators may be unwilling to share details of satellites used for</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">36</span>
                                                                {renderBlank(36, "w-48", false)}
                                                            </div>
                                                            <span>or commercial reasons.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>It may be hard to collect details of the object's</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">37</span>
                                                                {renderBlank(37, "w-48", false)}
                                                            </div>
                                                            <span>at a given time.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>Scientists can only make a</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">38</span>
                                                                {renderBlank(38, "w-48", false)}
                                                            </div>
                                                            <span>about where the satellite will go.</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">Solutions</h4>
                                                <ul className="list-disc ml-6 space-y-3">
                                                    <li className="text-lg pl-2">
                                                        <span>Common standards should be agreed on for the presentation of information.</span>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>The information should be combined in one</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">39</span>
                                                                {renderBlank(39, "w-48", false)}
                                                            </div>
                                                            <span>.</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>A coordinated system must be designed to create</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">40</span>
                                                                {renderBlank(40, "w-48", false)}
                                                            </div>
                                                            <span>in its users.</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 5 && (

                                <div className="animate-in fade-in duration-300">
                                    <h3 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800 font-serif">Elephant translocation</h3>

                                    <div className="border border-black p-8 bg-white">
                                        <div className="space-y-8">
                                            {/* Section 1 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 font-serif">Reasons for overpopulation at Majete National Park</h4>
                                                <ul className="list-none ml-6 space-y-2">
                                                    <li className="text-lg font-serif pl-2">strict enforcement of anti-poaching laws</li>
                                                    <li className="text-lg font-serif pl-2">successful breeding</li>
                                                </ul>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 font-serif">Problems caused by elephant overpopulation</h4>
                                                <ul className="list-none ml-6 space-y-2">
                                                    <li className="text-lg font-serif pl-2">greater competition, causing hunger for elephants</li>
                                                    <li className="text-lg font-serif pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>damage to</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 font-serif">31</span>
                                                                {renderBlank(31, "w-64", false)}
                                                            </div>
                                                            <span>in the park</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 font-serif">The translocation process</h4>
                                                <ul className="list-none ml-6 space-y-4">
                                                    <li className="text-lg font-serif pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>a suitable group of elephants from the same</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 font-serif">32</span>
                                                                {renderBlank(32, "w-64", false)}
                                                            </div>
                                                            <span>was selected</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg font-serif pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>vets and park staff made use of</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 font-serif">33</span>
                                                                {renderBlank(33, "w-48", false)}
                                                            </div>
                                                            <span>to help guide the elephants into an open plain</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg font-serif pl-2">
                                                        <span>elephants were immobilised with tranquilisers</span>
                                                        <ul className="list-none ml-8 mt-2 space-y-3">
                                                            <li className="text-lg font-serif pl-1">
                                                                <div className="flex flex-wrap items-baseline gap-2">
                                                                    <span>– this process had to be completed quickly to reduce</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-sm text-slate-700 font-serif">34</span>
                                                                        {renderBlank(34, "w-48", false)}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li className="text-lg font-serif pl-1">
                                                                <div className="flex flex-wrap items-baseline gap-2">
                                                                    <span>– elephants had to be turned on their</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-sm text-slate-700 font-serif">35</span>
                                                                        {renderBlank(35, "w-48", false)}
                                                                    </div>
                                                                    <span>to avoid damage to their lungs</span>
                                                                </div>
                                                            </li>
                                                            <li className="text-lg font-serif pl-1">
                                                                <div className="flex flex-wrap items-baseline gap-2">
                                                                    <span>– elephants'</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-sm text-slate-700 font-serif">36</span>
                                                                        {renderBlank(36, "w-48", false)}
                                                                    </div>
                                                                    <span>had to be monitored constantly</span>
                                                                </div>
                                                            </li>
                                                            <li className="text-lg font-serif pl-1">
                                                                <span>– tracking devices were fitted to the matriarchs</span>
                                                            </li>
                                                            <li className="text-lg font-serif pl-1">
                                                                <div className="flex flex-wrap items-baseline gap-2">
                                                                    <span>– data including the size of their tusks and</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-sm text-slate-700 font-serif">37</span>
                                                                        {renderBlank(37, "w-48", false)}
                                                                    </div>
                                                                    <span>was taken</span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="text-lg font-serif pl-2">
                                                        <span>elephants were taken by truck to their new reserve</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 4 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900 font-serif">Advantages of translocation at Nkhotakota Wildlife Park</h4>
                                                <ul className="list-none ml-6 space-y-4">
                                                    <li className="text-lg font-serif pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 font-serif">38</span>
                                                                {renderBlank(38, "w-48", false)}
                                                            </div>
                                                            <span>opportunities</span>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg font-serif pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>a reduction in the number of poachers and</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 font-serif">39</span>
                                                                {renderBlank(39, "w-48", false)}
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="text-lg font-serif pl-2">an example of conservation that other parks can follow</li>
                                                    <li className="text-lg font-serif pl-2">
                                                        <div className="flex flex-wrap items-baseline gap-2">
                                                            <span>an increase in</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-700 font-serif">40</span>
                                                                {renderBlank(40, "w-48", false)}
                                                            </div>
                                                            <span>as a contributor to GDP</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {test.id === 6 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8">
                                        <h3 className="text-3xl font-bold text-center mb-10 text-slate-800">Pockets</h3>

                                        <div className="space-y-8">
                                            {/* Section 1 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Reason for choice of subject</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">They are</span>
                                                            {renderBlank(31, "w-32")}
                                                            <span className="text-lg">but can be overlooked by consumers and designers.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Pockets in men’s clothes</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Men started to wear</span>
                                                            {renderBlank(32, "w-32")}
                                                            <span className="text-lg">in the 18th century.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">A</span>
                                                            {renderBlank(33, "w-32")}
                                                            <span className="text-lg">sewed pockets into the lining of the garments.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">The wearer could use the pockets for small items.</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Bigger pockets might be made for men who belonged to a certain type of</span>
                                                            {renderBlank(34, "w-32")}
                                                            <span className="text-lg">.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Pockets in women’s clothes</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Women’s pockets were less</span>
                                                            {renderBlank(35, "w-32")}
                                                            <span className="text-lg">than men’s.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">Women were very concerned about pickpockets.</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Pockets were produced in pairs using</span>
                                                            {renderBlank(36, "w-32")}
                                                            <span className="text-lg">to link them together.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Pockets hung from the women’s</span>
                                                            {renderBlank(37, "w-32")}
                                                            <span className="text-lg">under skirts and petticoats.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Items such as</span>
                                                            {renderBlank(38, "w-32")}
                                                            <span className="text-lg">could be reached through a gap in the material.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">Pockets, of various sizes, stayed inside clothing for many decades.</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">When dresses changed shape, hidden pockets had a negative effect on the</span>
                                                            {renderBlank(39, "w-32")}
                                                            <span className="text-lg">of women.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Bags called ‘pouches’ became popular, before women carried a</span>
                                                            {renderBlank(40, "w-32")}
                                                            <span className="text-lg">.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 1 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8">
                                        <h3 className="text-3xl font-bold text-center mb-10 text-slate-800">Microplastics</h3>

                                        <div className="space-y-8">
                                            {/* Section 1 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Where microplastics come from</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">fibres from some</span>
                                                            {renderBlank(31, "w-32")}
                                                            <span className="text-lg">during washing</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">the breakdown of large pieces of plastic</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">waste from industry</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">the action of vehicle tyres on roads</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Effects of microplastics</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">They cause injuries to the</span>
                                                            {renderBlank(32, "w-32")}
                                                            <span className="text-lg">of wildlife and affect their digestive systems.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">They enter the food chain, e.g., in bottled and tap water,</span>
                                                            {renderBlank(33, "w-32")}
                                                            <span className="text-lg">and seafood.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">They may not affect human health, but they are already banned in skin cleaning products and</span>
                                                            {renderBlank(34, "w-32")}
                                                            <span className="text-lg">in some countries.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Microplastics enter the soil through the air, rain and</span>
                                                            {renderBlank(35, "w-32")}
                                                            <span className="text-lg">.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Microplastics in the soil – a study by Anglia Ruskin University</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Earthworms are important because they add</span>
                                                            {renderBlank(36, "w-32")}
                                                            <span className="text-lg">to the soil.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">The study aimed to find whether microplastics in earthworms affect the</span>
                                                            {renderBlank(37, "w-32")}
                                                            <span className="text-lg">of plants.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">The study found that microplastics caused:</span>
                                                    </div>
                                                    <div className="ml-8 space-y-2">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-lg">–</span>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                {renderBlank(38, "w-32")}
                                                                <span className="text-lg">loss in earthworms</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-lg">–</span>
                                                            <span className="text-lg">fewer seeds to germinate</span>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-lg">–</span>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span className="text-lg">a rise in the level of</span>
                                                                {renderBlank(39, "w-32")}
                                                                <span className="text-lg">in the soil.</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3 mt-4">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">The study concluded:</span>
                                                    </div>
                                                    <div className="ml-8 space-y-2">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-lg">–</span>
                                                            <span className="text-lg">soil should be seen as an important natural process.</span>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-lg">–</span>
                                                            <div className="flex flex-wrap items-baseline gap-1">
                                                                <span className="text-lg">changes to soil damage both ecosystems and</span>
                                                                {renderBlank(40, "w-32")}
                                                                <span className="text-lg">.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 4 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                    <div className="border border-black p-8">
                                        <h3 className="text-3xl font-bold text-center mb-10 text-slate-800">Tree planting</h3>

                                        <div className="space-y-8">
                                            {/* Section 1 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Reforestation projects should:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">include a range of tree species</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">not include invasive species because of possible</span>
                                                            {renderBlank(31, "w-32")}
                                                            <span className="text-lg">with native species</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">aim to capture carbon, protect the environment and provide sustainable sources of</span>
                                                            {renderBlank(32, "w-32")}
                                                            <span className="text-lg">for local people</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">use tree seeds with a high genetic diversity to increase resistance to</span>
                                                            {renderBlank(33, "w-32")}
                                                            <span className="text-lg">and climate change</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">plant trees on previously forested land which is in a bad condition, not select land which is being used for</span>
                                                            {renderBlank(34, "w-32")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Large-scale reforestation projects</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">Base planning decisions on information from accurate</span>
                                                            {renderBlank(35, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">Drones are useful for identifying areas in Brazil which are endangered by keeping</span>
                                                            {renderBlank(36, "w-32")}
                                                            <span className="text-lg">and illegal logging.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 3 */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Lampang Province, Northern Thailand</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">A forest was restored in an area damaged by mining.</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">A variety of native fig trees were planted, which are important for:</span>
                                                    </div>
                                                    <ul className="list-disc ml-12 space-y-2">
                                                        <li className="text-lg">supporting many wildlife species</li>
                                                        <li className="text-lg">
                                                            <div>
                                                                <span className="text-lg">increasing the</span>
                                                                {renderBlank(37, "w-32")}
                                                                <span className="text-lg">of recovery by attracting animals and birds, e.g.,</span>
                                                                {renderBlank(38, "w-32")}
                                                                <span className="text-lg">were soon attracted to the area.</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Section 4 */}
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-slate-900">Involving local communities</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div>
                                                            <span className="text-lg">Destruction of mangrove forests in Madagascar made it difficult for people to make a living from</span>
                                                            {renderBlank(39, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">The mangrove reforestation project:</span>
                                                    </div>
                                                    <ul className="list-disc ml-12 space-y-2">
                                                        <li className="text-lg">provided employment for local people</li>
                                                        <li className="text-lg">restored a healthy ecosystem</li>
                                                        <li className="text-lg">
                                                            <div>
                                                                <span className="text-lg">protects against the higher risk of</span>
                                                                {renderBlank(40, "w-32")}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 2 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD ONLY</strong> for each answer.
                                    </p>

                                    <div className="border border-black p-8">
                                        <h3 className="text-3xl font-bold text-center mb-10 text-slate-800">Tardigrades</h3>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                    <span className="text-lg">more than 1,000 species, 0.05–1.2 millimetres long</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span className="text-lg">also known as water 'bears' (due to how they</span>
                                                        {renderBlank(31, "w-32")}
                                                        <span className="text-lg">) and 'moss piglets'</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Physical appearance</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">a</span>
                                                            {renderBlank(32, "w-32")}
                                                            <span className="text-lg">round body and four pairs of legs</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">claws or</span>
                                                            {renderBlank(33, "w-32")}
                                                            <span className="text-lg">for gripping</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">absence of respiratory organs</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">body filled with a liquid that carries both</span>
                                                            {renderBlank(34, "w-32")}
                                                            <span className="text-lg">and blood</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">mouth shaped like a</span>
                                                            {renderBlank(35, "w-32")}
                                                            <span className="text-lg">with teeth called stylets</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Habitat</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">often found at the bottom of a lake or on plants</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">very resilient and can exist in very low or high</span>
                                                            {renderBlank(36, "w-32")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Cryptobiosis</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">In dry conditions, they roll into a ball called a 'tun'.</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">They stay alive with a much lower metabolism than usual.</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">A type of</span>
                                                            {renderBlank(37, "w-32")}
                                                            <span className="text-lg">ensures their DNA is not damaged.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">Research is underway to find out how many days they can stay alive in</span>
                                                            {renderBlank(38, "w-32")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Feeding</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">consume liquids, e.g., those found in moss or</span>
                                                            {renderBlank(39, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">may eat other tardigrades</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Conservation status</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">They are not considered to be</span>
                                                            {renderBlank(40, "w-32")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {test.id === 3 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD ONLY</strong> for each answer.
                                    </p>

                                    {/* Main Content Box */}
                                    <div className="border border-black p-8">
                                        <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest text-slate-800">Céide Fields</h3>

                                        {/* Discovery Section */}
                                        <div className="mb-8">
                                            <h4 className="font-bold text-lg mb-3">Discovery</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Patrick Caulfield, a school teacher, noticed a number of stone</span>
                                                        {renderBlank(31, "w-24")}
                                                        <span>under the peat.</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Later, his</span>
                                                        {renderBlank(32, "w-24")}
                                                        <span>, who was an archaeologist, investigated.</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>Iron probes and carbon dating were used to show that the site was once a farming community.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Neolithic Farmers Section */}
                                        <div className="mb-8">
                                            <h4 className="font-bold text-lg mb-3">Neolithic farmers at Céide Fields</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>The farmers cleared the forest to provide</span>
                                                        {renderBlank(33, "w-24")}
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>There's evidence that the climate was different – less</span>
                                                        {renderBlank(34, "w-24")}
                                                        <span>than now.</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>Houses were</span>
                                                            {renderBlank(35, "w-28")}
                                                            <span>in shape and had a hole in the roof.</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                        <div className="w-full">
                                                            <div className="mb-2">Neolithic innovations include:</div>
                                                            <div className="ml-6 space-y-2">
                                                                <div className="flex items-start gap-2">
                                                                    <span className="text-slate-500">–</span>
                                                                    <span>cooking indoors</span>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <span className="text-slate-500">–</span>
                                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                                        <span>pots used for storage and to make</span>
                                                                        {renderBlank(36, "w-24")}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>Each field at Céide was large enough to support a big</span>
                                                            {renderBlank(37, "w-24")}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span>The fields were probably used to restrict the grazing of animals – no evidence of structures to house them during</span>
                                                            {renderBlank(38, "w-24")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decline Section */}
                                        <div className="mb-4">
                                            <h4 className="font-bold text-lg mb-3">Reasons for the decline in farming</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>a decline in</span>
                                                        {renderBlank(39, "w-24")}
                                                        <span>quality</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span>an increase in</span>
                                                        {renderBlank(40, "w-24")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {test.id === 11 && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="italic mb-2">Complete the notes below.</p>
                                    <p className="italic mb-6">
                                        Write <strong>ONE WORD ONLY</strong> for each answer.
                                    </p>

                                    <div className="border border-black p-8 bg-white">
                                        <h3 className="text-2xl font-bold text-center mb-10 text-slate-800">Early history of keeping clean</h3>

                                        <div className="space-y-8">
                                            {/* Prehistoric times */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Prehistoric times:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">water was used to wash off</span>
                                                            {renderBlank(31, "w-32")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ancient Babylon */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Ancient Babylon:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">soap-like material found in</span>
                                                            {renderBlank(32, "w-32")}
                                                            <span className="text-lg">cylinders</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ancient Greece */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Ancient Greece:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">people cleaned themselves with sand and other substances</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">used a strigil – scraper made of</span>
                                                            {renderBlank(33, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">washed clothes in streams</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ancient Germany and Gaul */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Ancient Germany and Gaul:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">used soap to colour their</span>
                                                            {renderBlank(34, "w-32")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ancient Rome */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Ancient Rome:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">animal fat, ashes and clay mixed through action of rain, used for washing clothes</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">from about 312 BC, water carried to Roman</span>
                                                            {renderBlank(35, "w-32")}
                                                            <span className="text-lg">by aqueducts</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Europe in Middle Ages */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Europe in Middle Ages:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">decline in bathing contributed to occurrence of</span>
                                                            {renderBlank(36, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            {renderBlank(37, "w-32")}
                                                            <span className="text-lg">began to be added to soap</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Europe from 17th century */}
                                            <div>
                                                <h4 className="font-bold text-xl mb-4 text-slate-900">Europe from 17th century:</h4>
                                                <div className="space-y-4 ml-2">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <span className="text-lg">1600s: cleanliness and bathing started becoming usual</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">1791: Leblanc invented a way of making soda ash from</span>
                                                            {renderBlank(38, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">early 1800s: Chevreul turned soapmaking into a</span>
                                                            {renderBlank(39, "w-32")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-2 w-2 h-2 rounded-full bg-slate-800 shrink-0"></span>
                                                        <div className="flex flex-wrap items-baseline gap-1">
                                                            <span className="text-lg">from 1800s, there was no longer a</span>
                                                            {renderBlank(40, "w-32")}
                                                            <span className="text-lg">on soap</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    )
                }


                {
                    activePart === 4 && test.id === 12 && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-12">

                                <p className="italic mb-2">Complete the notes below.</p>
                                <p className="italic mb-6">Write <strong>ONE WORD ONLY</strong> for each answer.</p>

                                <div className="border border-black p-8 bg-white max-w-4xl mx-auto shadow-sm">
                                    <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">How the Industrial Revolution affected life in Britain</h3>

                                    {/* 19th century */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-xl mb-4 text-slate-900 border-b border-gray-300 pb-2">19th century</h4>
                                        <div className="space-y-4 ml-2">
                                            <div className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                    <span>For the first time, people's possessions were used to measure Britain's</span>
                                                    {renderBlank(31, "w-40")}
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                    <span>Developments in production of goods and in</span>
                                                    {renderBlank(32, "w-40")}
                                                    <span>greatly changed lives.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MAIN AREAS OF CHANGE */}
                                    <div>
                                        <h4 className="font-bold text-xl mb-6 text-slate-900 border-b border-gray-300 pb-2 uppercase tracking-wide">MAIN AREAS OF CHANGE</h4>

                                        {/* Manufacturing */}
                                        <div className="mb-8 ml-4">
                                            <h5 className="font-bold text-lg mb-3 text-slate-800">Manufacturing</h5>
                                            <div className="space-y-4 ml-2">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                        <span>The Industrial Revolution would not have happened without the new types of</span>
                                                        {renderBlank(33, "w-40")}
                                                        <span>that were used then.</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                        <span>The leading industry was</span>
                                                        {renderBlank(34, "w-40")}
                                                        <span>(its products became widely available).</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                        <span>New</span>
                                                        {renderBlank(35, "w-40")}
                                                        <span>made factories necessary and so more people moved into towns.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Transport */}
                                        <div className="mb-8 ml-4">
                                            <h5 className="font-bold text-lg mb-3 text-slate-800">Transport</h5>
                                            <div className="space-y-4 ml-2">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="text-lg">The railways took the place of canals.</div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="text-lg">Because of the new transport:</div>
                                                </div>
                                                <div className="ml-8 space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-slate-500 mt-1">–</span>
                                                        <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                            <span>greater access to</span>
                                                            {renderBlank(36, "w-40")}
                                                            <span>made people more aware of what they could buy in shops.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-slate-500 mt-1">–</span>
                                                        <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                            <span>when shopping, people were not limited to buying</span>
                                                            {renderBlank(37, "w-40")}
                                                            <span>goods.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Retailing */}
                                        <div className="mb-8 ml-4">
                                            <h5 className="font-bold text-lg mb-3 text-slate-800">Retailing</h5>
                                            <div className="space-y-4 ml-2">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="text-lg">The first department stores were opened.</div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="text-lg">The displays of goods were more visible:</div>
                                                </div>
                                                <div className="ml-8 space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-slate-500 mt-1">–</span>
                                                        <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                            <span>inside stores because of better</span>
                                                            {renderBlank(38, "w-40")}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-slate-500 mt-1">–</span>
                                                        <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                            <span>outside stores, because</span>
                                                            {renderBlank(39, "w-40")}
                                                            <span>were bigger.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                                                    <div className="flex flex-wrap items-baseline gap-1 text-lg">
                                                        {renderBlank(40, "w-40", true, "line")}
                                                        <span>that was persuasive became much more common.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Pagination Controls */}
                <div className="flex justify-between max-w-4xl mx-auto mt-6 px-4">
                    <button
                        onClick={() => setActivePart(Math.max(1, activePart - 1))}
                        disabled={activePart === 1}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activePart === 1
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200'
                            }`}
                    >
                        <span>←</span> Previous Part
                    </button>
                    <button
                        onClick={() => setActivePart(Math.min(4, activePart + 1))}
                        disabled={activePart === 4}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activePart === 4
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200'
                            }`}
                    >
                        Next Part <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListeningWorksheet;
