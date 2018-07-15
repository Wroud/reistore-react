import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import "mocha";
import * as React from "react";

import { connect, StoreProvider, Primitive, withPrimitive } from "../src";
import { Path, createStore, Store } from "reistore";

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
    interface IProps {
        id: number,
        b: number,
        user: User
    }
    
    const store = createStore<IStore>(undefined, { users: [{ name: "abs" }, { name: "cc" }], b: 7 });
    const userPath = Path.create<IStore, IUser>((f: IStore) => f.users["{}"]);
    const userNamePath = userPath.join(f => f.name);

    class User extends Primitive<IStore, IUser, IRes>{
        map = (state: IStore, props: IRes) => {
            return this.store.get(userPath, props.id);
        }
        changeName = (name: string) => {
            this.store.set(userNamePath, name, this.props.id);
        }
    }

    function myComponent(props: IProps) {
        return (
            <div onClick={() => props.user.changeName("hdhd")}>
                {props.id}{props.user.state.name}{props.children}
            </div>
        );
    }

    const ConnectedComponent = connect<IStore, { b: number }, Pick<IProps, "id">, { b: number }>(
        ({ b }, props) => ({ b }),
        undefined,
        changes => changes.some(path => path.includes(Path.create(f => f.b)))
    )(withPrimitive<IStore, IProps, { user: typeof User }>(
        { user: User }
    )(myComponent));
    beforeEach(() => {
        wrapper = mount(
            <div>
                <StoreProvider value={store}>
                    <ConnectedComponent id={0}>
                        <ConnectedComponent id={1} />
                    </ConnectedComponent>
                </StoreProvider>
            </div>
        );
    });

    it("correct render", () => {
        const result = wrapper.find("myComponent").first().props() as any as IProps;

        expect(result.b).to.be.equal(7);
        expect(result.id).to.be.equal(0);
        expect(result.user.state.name).to.be.equal("abs");
    });
    it("correct update", () => {
        store.instructor.set(Path.create(f => f.b), 10);
        let result = wrapper.update().find("myComponent").first().props() as any as IProps;

        expect(result.b).to.be.equal(10);
        expect(result.id).to.be.equal(0);
        expect(result.user.state.name).to.be.equal("abs");

        result.user.changeName("kek");
        result = wrapper.update().find("myComponent").first().props() as any as IProps;

        expect(result.b).to.be.equal(10);
        expect(result.id).to.be.equal(0);
        expect(result.user.state.name).to.be.equal("kek");
        expect(store.state.b).to.be.equal(10);
    });
});
