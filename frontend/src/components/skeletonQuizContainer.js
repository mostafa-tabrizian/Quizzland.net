import Skeleton from '@mui/material/Skeleton';

const SkeletonQuizContainer = () => {
    return (
        <div>
            <div className='flex flex-col ml-4 space-y-3 md:hidden'>
                <div className='flex'>
                    <Skeleton variant="rounded" animation="wave" width={210} height={120} />
                    <div className='w-1/2 mr-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='flex'>
                    <Skeleton variant="rounded" animation="wave" width={210} height={120} />
                    <div className='w-1/2 mr-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='flex'>
                    <Skeleton variant="rounded" animation="wave" width={210} height={120} />
                    <div className='w-1/2 mr-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='flex'>
                    <Skeleton variant="rounded" animation="wave" width={210} height={120} />
                    <div className='w-1/2 mr-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
            </div>
            
            <div className='flex-row flex-wrap hidden md:flex'>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
                <div className='mx-4 mb-8'>
                    <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                    <div className='w-full mt-3'>
                        <Skeleton width="50%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                        <Skeleton width="100%" animation="wave" />
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default SkeletonQuizContainer;