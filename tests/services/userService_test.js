import { assertEquals } from "https://deno.land/std@0.202.0/testing/asserts.ts";
import * as userService from "../../services/userService.js";

Deno.test({
    name: "findUserByEmail should return admin user with admin@admin.com", 
    async fn() {
        const user = await userService.findUserByEmail("admin@admin.com")
        assertEquals(user.admin, true);
    }, 
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test("findUserByEmail should return null with non-existing user", async () => {
    const user = await userService.findUserByEmail("void@void.com")
    assertEquals(user, null);
});

Deno.test({
    name: "The added user should exist and not be admin", 
    async fn() {
        const user = await userService.findUserByEmail("auser@notadmin.com")
        if (!user) {
            await userService.addUser("auser@notadmin.com", "password");
        }
        assertEquals(user.admin, false);
    }, 
    sanitizeResources: false,
    sanitizeOps: false,
});
