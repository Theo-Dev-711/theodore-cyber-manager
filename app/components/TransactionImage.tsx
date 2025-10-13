import React from "react";
import Image from "next/image";

interface TransactionImageProps {
    src: string | null;
    alt: string;
    heightClass?: string;
    widthClass?: string;
}

const TransactionImage: React.FC<TransactionImageProps> = ({
    src,
    alt,
    heightClass,
    widthClass,
}) => {
    const imageSrc = src || "/placeholder-image.jpg";
    return (
        <div className="avatar">
            <div className={`mask mask-squircle ${heightClass} ${widthClass}`}>
                <Image
                    src={imageSrc}
                    alt={alt || "Transaction Image"}
                    quality={100}
                    className="object-cover"
                    height={500}
                    width={500}
                />
            </div>
        </div>
    );
};

export default TransactionImage;
