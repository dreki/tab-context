import React from "react";

interface IDivideChildrenProps {
    children: React.ReactNode;
}

// This component renders all children, with a `.divider` between them.
export const DivideChildren = ({ children }: IDivideChildrenProps) => {
    return (
        <>
            {React.Children.map(children, (child, index) => {
                return (
                    <>
                        {child}
                        {index < React.Children.count(children) - 1 && (
                            <div className="divider" />
                        )}
                    </>
                );
            })}
        </>
    );
};
