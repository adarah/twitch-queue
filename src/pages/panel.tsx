import { useAtom } from 'jotai';
import { api } from '../utils/api';
import * as twitch from '../utils/twitch';
const Panel = () => {
    const [identified] = useAtom(twitch.viewerIdentified)
    const p = api.queue.getByChannelId.useQuery();
    return (
        <div>
            {!identified && <IdentityWarning />}
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error totam consequatur incidunt obcaecati cumque corrupti iste, inventore odio officia quia placeat dolore perspiciatis sint possimus quisquam, unde animi ea delectus.
            </p>
            <p>
                {JSON.stringify(p.data)}
            </p>
        </div>
    )
}

const IdentityWarning = () => {
    return (
        <div className='alert alert-warning shadow-lg'>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span> Only authenticated users may join the queue</span>
            </div>
            <div>
                <button className='btn btn-primary' onClick={twitch.requestViewerIdentity}>Authenticate</button>
            </div>
        </div>
    )
}

export default Panel;