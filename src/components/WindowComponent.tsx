// import { IWindow } from "../stores";
import { TabList } from "./TabList";
import { Window } from "../stores/window";

interface WindowComponentProps {
    window: Window;

    // A callback for when the user wants to save the window's current state to a session.
    //   onSaveWindowToSession: (window: Window) => void;
    onSuspend: (window: Window) => void;
}

export function WindowComponent(props: WindowComponentProps) {
    return (
        <div className="card-bordered card card-compact mb-8 bg-slate-50 shadow-md">
            <div className="overflow-hidden bg-slate-200 rounded-t-2xl p-2">
                <TabList tabs={props.window.tabs} />
            </div>
            <div className="card-body">
                <div>
                    Window ID: {props.window.id} (index: {props.window.index})
                </div>
                <div className="card-actions mt-2">
                    <button
                        className="btn-primary btn-sm btn"
                        onClick={() => props.onSuspend(props.window)}
                    >
                        Suspend
                    </button>
                </div>
            </div>
        </div>
    );
    // return (
    //     <div className="flex justify-start">
    //         <div className="block max-w-sm rounded-lg bg-white text-left shadow-lg">
    //             <div className="p-6">
    //                 <div className="overflow-hidden">
    //                     <TabList tabs={props.window.tabs} />
    //                 </div>
    //             </div>
    //             <div className="border-t border-gray-300 py-3 px-6 text-gray-600">
    //                 <button
    //                     className="btn-primary btn-sm btn"
    //                     onClick={() => props.onSuspend(props.window)}
    //                 >
    //                     Suspend
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );
}
