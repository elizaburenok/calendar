# Component From Figma MCP

**Usage**: `/component-analysis`  
This command walks through a strict, step‑by‑step workflow:  
1) Read the Figma MCP link for the FULL component  
2) Detect and list atomic elements  
3) Implement and test each atom one by one in `src/components/atoms`  
4) Assemble the final component only after all atoms are ready and confirmed.

---

## Step 1 – Read Figma MCP & Detect Atoms (no implementation)

1. Ask the user:

   > "Paste the Figma MCP link (Dev Mode MCP server) to the FULL component you want to implement (not a single atom, but the composed UI)."

2. Use the Figma MCP link only to **read and understand** the component:
   - Inspect hierarchy, layers, variants, and states in Figma MCP.
   - Identify which parts are suitable to become **atoms** (e.g. checkbox, label, icon, badge, counter, etc.).

3. Build a clear list of atomic elements for this component and show it to the user, for example:

   ```md
   ## Detected atoms for [COMPONENT_NAME]

   1. Checkbox
   2. TaskText
   3. StatusBadge
   ```

4. Explicitly do not start any implementation yet at this step.

5. After listing the atoms, show the list to the user and ask for confirmation, for example:

   > "Here is the list of atoms I detected from the Figma MCP component.  
   > Please review it carefully.  
   > If this list is correct, reply with: Start detailed atomic implementation.  
   > If something is missing or wrong, tell me how to adjust the list (add, remove, or rename atoms), and I will update it before we continue."

6. Wait for the user’s explicit confirmation:
   - If the user responds with **Start detailed atomic implementation**, proceed to **Step 2 – Detailed Analysis & Implementation of Each Atom**.
   - If the user requests changes, update the atoms list and show the revised list again, then ask for confirmation once more before moving to Step 2.

---

## Step 2 – Detailed Analysis & Implementation of Each Atom

This step starts only after the user explicitly writes something like: **"Start detailed atomic implementation."**  
For each atom in the confirmed list, follow this strict loop:

1. Ask the user which atom to implement next, for example:

   > "Which atom should be implemented next from the confirmed list?  
   > Please answer with one of: [AtomName1], [AtomName2], ..."

2. Ask the user:
   > "Paste the Figma MCP link (Dev Mode MCP server) to the atom you want to implement."

3. Analyze that atom in detail using the Figma MCP link provided:
   - Read its states, variants, interactions, and constraints.
   - Identify required props, events, and visual states.

4. Create a React atom component in `src/components/atoms/[AtomName].jsx`:
   - Define explicit, well‑documented props based on the analysis.
   - Keep the atom focused and reusable.

5. Create or update a small local test harness (e.g. in your existing test‑stand or story‑style file) that renders this atom with different props and states, so it can be checked on localhost.

6. Ask the user to verify on localhost:

   > "The atom [AtomName] has been implemented and wired into the local test environment.  
   > Please open localhost and verify its behavior and appearance against the Figma MCP component.  
   > If anything is off, describe the issues and I will iterate until it matches."

7. Iterate on the current atom until the user confirms it is correct:
   - Only after the user confirms that **[AtomName]** is working correctly and matches Figma, ask which atom to implement next.
   - Repeat steps 1–7 for each remaining atom in the list.

When all atoms from the confirmed list are implemented, tested, and confirmed by the user, proceed to **Step 3 – Assemble the Final Component**.

---

## Step 3 – Assemble the Final Component

1. Ask the user for confirmation to start assembly, for example:

   > "All atoms from the confirmed list are implemented and tested.  
   > Do you want to assemble the final component [COMPONENT_NAME] now?"

2. Use the Figma MCP link again to verify:
   - Layout and hierarchy of atoms.
   - Variants and states of the full component.
   - Interaction logic and state flows.

3. Create the composed component file (for example, in `src/components/[COMPONENT_NAME].jsx` or another agreed path):
   - Import the confirmed atoms from `src/components/atoms`.
   - Wire their props, state, and interactions so that the composed component behaves as in Figma MCP.
   - Keep the API of the composed component clean and well‑documented.

4. Update the local test‑stand / preview to render the full component with several realistic scenarios.

5. Ask the user for a final check:

   > "[COMPONENT_NAME] has been assembled from the confirmed atoms and is available on the local test stand.  
   > Please compare it with the Figma MCP component.  
   > If adjustments are needed, describe them and I will iterate."

Never start implementation before:
- Reading the Figma MCP link for the full component.  
- Listing and confirming the atoms with the user.

Always:
- Implement one atom at a time.  
- Test each atom on localhost before moving to the next.  
- Assemble the full component only when all atoms are implemented and confirmed.
