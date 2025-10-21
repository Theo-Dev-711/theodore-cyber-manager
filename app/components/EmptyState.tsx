import { icons } from 'lucide-react'
import React, { FC } from 'react'

interface EmptyStateProps {
    IconComponent: keyof typeof icons
    message: string
}

const EmptyState: FC<EmptyStateProps> = ({ IconComponent, message }) => {
    const SelectedIcon = icons[IconComponent]

    return (
        <div className='w-full h-full my-20 flex justify-center items-center flex-col'>
            <div className='animate-wiggle'>
                <SelectedIcon strokeWidth={1} className='w-40 h-40 text-primary' />
            </div>
            <p className='text-sm mt-4 text-gray-500'>{message}</p>
        </div>
    )
}

export default EmptyState

