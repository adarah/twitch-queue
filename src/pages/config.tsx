import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { clsx } from 'clsx';
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

const Config = () => {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-4">
                <Form />
            </div>
        </>
    )
}

export default Config;


const Header = () => {
    return (
        <div className="flex flex-col">
            <div className="bg-primary h-16 justify-center items-center">
                <span className="primary-content uppercase font-bold px-4"> Configuration </span>
            </div>
        </div>
    );
}

const schema = z.object({
    queueName: z.string().min(1).max(191),
    rewardId: z.string().length(36)
})

const Form = () => {
    const q = api.queue.getByChannelId.useQuery()
    const mutation = api.queue.upsert.useMutation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    if (q.isLoading) {
        return (
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"> </svg>
        )
    }
    return (
        <form onSubmit={handleSubmit(data => mutation.mutate({ name: data.queueName, rewardId: data.rewardId }))}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Queue Title &nbsp;
                        <span className="tooltip" data-tip='Visible to viewers'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                    </span>
                </label>
                <input
                    {...register('queueName', { required: true, minLength: 1, maxLength: 191, value: q.data?.name })}
                    className={clsx("input input-bordered", errors.queueName && "input-error")}
                    placeholder="Dota2 - First four play with me!"
                />
                <p className="text-red-500">{errors.queueName?.message}&nbsp;</p>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Channel Points Reward ID &nbsp;
                        <span className="tooltip" data-tip='The ID of the Channel Point Reward that should add users to the queue when redeemed. To find the reward ID, open the reward in the creator dashboard and extract it from the URL'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                    </span>
                </label>
                <input
                    {...register('rewardId', { required: true, minLength: 36, maxLength: 36, value: q.data?.channelPointRewardId })}
                    className={clsx("input input-bordered", errors.queueName && "input-error")}
                    placeholder="24d5d7f0-40f8-4ca7-ad7e-311b5708d183"
                />
                <p className="text-red-500">{errors.rewardId?.message}&nbsp;</p>
            </div>

            <div className="space-x-3">
                <button className={clsx("btn btn-primary", mutation.isLoading && "loading")}>Save</button>
                {mutation.isSuccess &&
                    <span className="text-green-600 space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Saved</span>
                    </span>
                }
            </div>
        </form>
    );
}