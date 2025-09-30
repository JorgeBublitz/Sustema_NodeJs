import prisma from "../database/prismaClient"
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function main() {
    const passwordHash = await bcrypt.hash("123456", SALT_ROUNDS);

    // 🔹 Usuários médicos
    const doctors = await Promise.all([
        prisma.user.create({
            data: {
                name: "Dr. Strange",
                age: 45,
                gender: "MALE",
                email: "doctor1@example.com",
                password: passwordHash,
                role: "DOCTOR",
                doctor: {
                    create: {
                        crmNumber: "CRM001",
                        crmState: "SP",
                        specialty: "Cardiology",
                        department: "EMERGENCY",
                        workStatus: "WORKING",
                    },
                },
            },
            include: { doctor: true },
        }),
        prisma.user.create({
            data: {
                name: "Dr. House",
                age: 50,
                gender: "MALE",
                email: "doctor2@example.com",
                password: passwordHash,
                role: "DOCTOR",
                doctor: {
                    create: {
                        crmNumber: "CRM002",
                        crmState: "RJ",
                        specialty: "Nephrology",
                        department: "ICU",
                        workStatus: "WORKING",
                    },
                },
            },
            include: { doctor: true },
        }),
        prisma.user.create({
            data: {
                name: "Dr. Meredith Grey",
                age: 38,
                gender: "FEMALE",
                email: "doctor3@example.com",
                password: passwordHash,
                role: "DOCTOR",
                doctor: {
                    create: {
                        crmNumber: "CRM003",
                        crmState: "MG",
                        specialty: "Surgery",
                        department: "SURGERY",
                        workStatus: "WORKING",
                    },
                },
            },
            include: { doctor: true },
        }),
    ]);

    // 🔹 Usuários enfermeiros
    const nurses = await Promise.all([
        prisma.user.create({
            data: {
                name: "Nurse Joy",
                age: 30,
                gender: "FEMALE",
                email: "nurse1@example.com",
                password: passwordHash,
                role: "NURSE",
                nurse: {
                    create: {
                        corenNumber: "COREN001",
                        corenState: "SP",
                        level: "ASSISTANT",
                        department: "WARD",
                        experience: 2,
                        workStatus: "WORKING",
                    },
                },
            },
            include: { nurse: true },
        }),
        prisma.user.create({
            data: {
                name: "Nurse Jackie",
                age: 40,
                gender: "FEMALE",
                email: "nurse2@example.com",
                password: passwordHash,
                role: "NURSE",
                nurse: {
                    create: {
                        corenNumber: "COREN002",
                        corenState: "RJ",
                        level: "TECHNICIAN",
                        department: "ICU",
                        experience: 5,
                        workStatus: "WORKING",
                    },
                },
            },
            include: { nurse: true },
        }),
        prisma.user.create({
            data: {
                name: "Nurse Mike",
                age: 28,
                gender: "MALE",
                email: "nurse3@example.com",
                password: passwordHash,
                role: "NURSE",
                nurse: {
                    create: {
                        corenNumber: "COREN003",
                        corenState: "MG",
                        level: "GRADUATE",
                        department: "SURGERY",
                        experience: 3,
                        workStatus: "WORKING",
                    },
                },
            },
            include: { nurse: true },
        }),
    ]);

    // 🔹 Usuários secretários
    const secretaries = await Promise.all([
        prisma.user.create({
            data: {
                name: "Alice Secretary",
                age: 25,
                gender: "FEMALE",
                email: "secretary1@example.com",
                password: passwordHash,
                role: "SECRETARY",
                secretary: {
                    create: { workStatus: "WORKING", shift: "MORNING" },
                },
            },
            include: { secretary: true },
        }),
        prisma.user.create({
            data: {
                name: "Bob Secretary",
                age: 35,
                gender: "MALE",
                email: "secretary2@example.com",
                password: passwordHash,
                role: "SECRETARY",
                secretary: {
                    create: { workStatus: "WORKING", shift: "AFTERNOON" },
                },
            },
            include: { secretary: true },
        }),
        prisma.user.create({
            data: {
                name: "Clara Secretary",
                age: 29,
                gender: "FEMALE",
                email: "secretary3@example.com",
                password: passwordHash,
                role: "SECRETARY",
                secretary: {
                    create: { workStatus: "WORKING", shift: "NIGHT" },
                },
            },
            include: { secretary: true },
        }),
    ]);

    // 🔹 Pacientes
    const patients = await Promise.all([
        prisma.patient.create({
            data: {
                name: "John Doe",
                age: 60,
                gender: "MALE",
                email: "patient1@example.com",
                birthDate: new Date("1965-01-01"),
                condition: "WAITING",
                location: "WARD",
            },
        }),
        prisma.patient.create({
            data: {
                name: "Jane Smith",
                age: 45,
                gender: "FEMALE",
                email: "patient2@example.com",
                birthDate: new Date("1980-05-12"),
                condition: "REST",
                location: "ICU",
            },
        }),
        prisma.patient.create({
            data: {
                name: "Carlos Silva",
                age: 50,
                gender: "MALE",
                email: "patient3@example.com",
                birthDate: new Date("1975-08-20"),
                condition: "IN_SURGERY",
                location: "SURGERY",
            },
        }),
    ]);

    // 🔹 Appointments
    await Promise.all([
        prisma.appointment.create({
            data: {
                dateTime: new Date(),
                type: "CHECKUP",
                status: "SCHEDULED",
                notes: "Consulta de rotina",
                patientId: patients[0].id,
                secretaryId: secretaries[0].secretary!.id,
                doctorId: doctors[0].doctor!.id,
                nurseId: nurses[0].nurse!.id,
            },
        }),
        prisma.appointment.create({
            data: {
                dateTime: new Date(),
                type: "SURGERY",
                status: "SCHEDULED",
                notes: "Cirurgia cardíaca",
                patientId: patients[1].id,
                secretaryId: secretaries[1].secretary!.id,
                doctorId: doctors[1].doctor!.id,
                nurseId: nurses[1].nurse!.id,
            },
        }),
        prisma.appointment.create({
            data: {
                dateTime: new Date(),
                type: "FOLLOW_UP",
                status: "SCHEDULED",
                notes: "Revisão pós cirurgia",
                patientId: patients[2].id,
                secretaryId: secretaries[2].secretary!.id,
                doctorId: doctors[2].doctor!.id,
                nurseId: nurses[2].nurse!.id,
            },
        }),
    ]);

    console.log("✅ Seed concluído com sucesso!");
}

main()
    .catch((e) => {
        console.error("Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
