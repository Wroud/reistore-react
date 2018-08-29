import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import "mocha";
import * as React from "react";

import { StoreProvider, Subscriber, StoreConsumer, StateProvider } from "../src";
import { createStore, Store, buildSchema } from "reistore";

describe("Connector", () => {
    let wrapper: ReactWrapper<any, any>;
    interface IRes {
        id: number
    }
    interface IUser {
        name: string
    }
    interface IStore {
        users: IUser[],
        b: number,
    }

    const store = createStore<IStore>({ users: [{ name: "abs" }, { name: "cc" }], b: 7 });
    const { schema: { b, users } } = buildSchema<IStore>()
        .field("b")
        .array("users", b =>
            b.field("name")
        );

    const UserComponent = (props: IRes) => {
        return (
            <StateProvider>
                {subscriber => {
                    let user = subscriber.get(users(props.id));
                    let changeName = () =>
                        subscriber.store.set(users(props.id, u => u.name), "hdhd");
                    return (
                        <div onClick={changeName}>
                            {user.name}
                        </div>
                    );
                }}
            </StateProvider>
        );
    }
    beforeEach(() => {
        wrapper = mount(
            <div>
                <StoreProvider value={store}>
                    <StateProvider>
                        {subscriber => <span>{subscriber.get(b)}</span>}
                    </StateProvider>
                    <UserComponent id={0} />
                </StoreProvider>
            </div>
        );
    });

    it("correct render", () => {
        const result = wrapper.find("UserComponent").first().props() as any as IRes;
        const div = wrapper.find("UserComponent div").first().text();
        const span = wrapper.find("span").first().text();

        expect(result.id).to.be.equal(0);
        expect(div).to.be.equal("abs");
        expect(span).to.be.equal("7");
    });
    it("correct update", () => {
        store.set(b, 10);
        let result = wrapper.find("UserComponent").first().props() as any as IRes;
        let div = wrapper.find("UserComponent div").first().text();
        const span = wrapper.find("span").first().text();

        expect(result.id).to.be.equal(0);
        expect(div).to.be.equal("abs");
        expect(span).to.be.equal("10");

        store.set(users(0, u => u.name), "kek");
        div = wrapper.update().find("UserComponent div").first().text();

        expect(result.id).to.be.equal(0);
        expect(div).to.be.equal("kek");
        expect(span).to.be.equal("10");
    });
});
